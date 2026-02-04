"""
Agent B - Weather Agent
Purpose: Add environmental context to the infrastructure map

Inputs: Weather API (OpenWeather / IMD)

What it does:
- Fetches current + forecasted weather
- Converts into risk labels
- Publishes weather data for map overlay

Outputs:
- Publishes to 'weather-processed-topic'
"""

import os
import json
import logging
import httpx
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, asdict
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# OpenWeather API Key (set in .env)
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

# Risk thresholds
RAIN_THRESHOLDS = {
    "NONE": 0,
    "LIGHT": 2.5,
    "MODERATE": 7.5,
    "HEAVY": 15,
    "EXTREME": 30
}

FLOOD_RISK_MAPPING = {
    "NONE": "NONE",
    "LIGHT": "LOW",
    "MODERATE": "MEDIUM",
    "HEAVY": "HIGH",
    "EXTREME": "CRITICAL"
}


@dataclass
class WeatherData:
    """Weather data structure for map"""
    city: str
    lat: float
    lng: float
    temperature: float
    humidity: float
    wind_speed: float
    weather_condition: str
    weather_description: str
    rain_1h: float  # mm in last hour
    rain_intensity: str
    flood_risk: str
    visibility: str
    cloud_cover: int
    timestamp: str
    forecast_3h: Optional[dict] = None


class WeatherAgent:
    """
    Agent B: Fetches and processes weather data
    - Fetches current weather from OpenWeather API
    - Calculates risk labels
    - Provides flood and visibility warnings
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.cache: dict = {}
        self.cache_ttl = 300  # 5 minutes
        logger.info("🌤️ Weather Agent initialized")
    
    def _get_rain_intensity(self, rain_mm: float) -> str:
        """Convert rain mm to intensity label"""
        if rain_mm >= RAIN_THRESHOLDS["EXTREME"]:
            return "EXTREME"
        elif rain_mm >= RAIN_THRESHOLDS["HEAVY"]:
            return "HEAVY"
        elif rain_mm >= RAIN_THRESHOLDS["MODERATE"]:
            return "MODERATE"
        elif rain_mm >= RAIN_THRESHOLDS["LIGHT"]:
            return "LIGHT"
        return "NONE"
    
    def _get_flood_risk(self, rain_intensity: str, humidity: float) -> str:
        """Calculate flood risk based on rain and humidity"""
        base_risk = FLOOD_RISK_MAPPING.get(rain_intensity, "NONE")
        
        # Increase risk if humidity is very high
        if humidity >= 90 and base_risk == "MEDIUM":
            return "HIGH"
        elif humidity >= 95 and base_risk == "HIGH":
            return "CRITICAL"
        
        return base_risk
    
    def _get_visibility_label(self, visibility_m: int) -> str:
        """Convert visibility meters to label"""
        if visibility_m < 100:
            return "ZERO"
        elif visibility_m < 500:
            return "VERY_LOW"
        elif visibility_m < 1000:
            return "LOW"
        elif visibility_m < 5000:
            return "MODERATE"
        return "GOOD"
    
    async def fetch_weather(self, lat: float, lng: float, city: str = "Unknown") -> Optional[WeatherData]:
        """Fetch current weather for a location"""
        if not self.api_key:
            logger.warning("⚠️ No OpenWeather API key configured, using mock data")
            return self._get_mock_weather(lat, lng, city)
        
        cache_key = f"{lat:.2f},{lng:.2f}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if (datetime.utcnow() - cached_time).total_seconds() < self.cache_ttl:
                return cached_data
        
        try:
            url = f"{self.base_url}/weather"
            params = {
                "lat": lat,
                "lon": lng,
                "appid": self.api_key,
                "units": "metric"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
            
            # Extract rain data (might not be present)
            rain_1h = 0.0
            if "rain" in data:
                rain_1h = data["rain"].get("1h", 0.0)
            
            rain_intensity = self._get_rain_intensity(rain_1h)
            flood_risk = self._get_flood_risk(rain_intensity, data["main"]["humidity"])
            visibility_label = self._get_visibility_label(data.get("visibility", 10000))
            
            weather_data = WeatherData(
                city=data.get("name", city),
                lat=lat,
                lng=lng,
                temperature=data["main"]["temp"],
                humidity=data["main"]["humidity"],
                wind_speed=data["wind"]["speed"],
                weather_condition=data["weather"][0]["main"],
                weather_description=data["weather"][0]["description"],
                rain_1h=rain_1h,
                rain_intensity=rain_intensity,
                flood_risk=flood_risk,
                visibility=visibility_label,
                cloud_cover=data["clouds"]["all"],
                timestamp=datetime.utcnow().isoformat()
            )
            
            # Cache result
            self.cache[cache_key] = (weather_data, datetime.utcnow())
            
            return weather_data
            
        except httpx.HTTPError as e:
            logger.error(f"Weather API error: {e}")
            return self._get_mock_weather(lat, lng, city)
        except Exception as e:
            logger.error(f"Weather fetch error: {e}")
            return self._get_mock_weather(lat, lng, city)
    
    def _get_mock_weather(self, lat: float, lng: float, city: str) -> WeatherData:
        """Return mock weather data for testing"""
        import random
        
        rain_options = ["NONE", "LIGHT", "MODERATE", "HEAVY"]
        rain_intensity = random.choice(rain_options)
        rain_1h = RAIN_THRESHOLDS.get(rain_intensity, 0) + random.uniform(0, 2)
        
        return WeatherData(
            city=city or "Mumbai",
            lat=lat,
            lng=lng,
            temperature=round(random.uniform(25, 35), 1),
            humidity=round(random.uniform(60, 95), 1),
            wind_speed=round(random.uniform(2, 15), 1),
            weather_condition="Rain" if rain_intensity != "NONE" else "Clouds",
            weather_description=f"{rain_intensity.lower()} rain" if rain_intensity != "NONE" else "partly cloudy",
            rain_1h=round(rain_1h, 1),
            rain_intensity=rain_intensity,
            flood_risk=FLOOD_RISK_MAPPING.get(rain_intensity, "NONE"),
            visibility="MODERATE",
            cloud_cover=random.randint(20, 80),
            timestamp=datetime.utcnow().isoformat()
        )
    
    def fetch_weather_sync(self, lat: float, lng: float, city: str = "Unknown") -> Optional[WeatherData]:
        """Synchronous version of fetch_weather for non-async contexts"""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(self.fetch_weather(lat, lng, city))
    
    def to_kafka_message(self, weather: WeatherData) -> str:
        """Convert weather data to Kafka message"""
        return json.dumps(asdict(weather))
    
    def get_weather_summary(self, weather: WeatherData) -> dict:
        """Get a summary for map display"""
        return {
            "city": weather.city,
            "lat": weather.lat,
            "lng": weather.lng,
            "rainIntensity": weather.rain_intensity,
            "floodRisk": weather.flood_risk,
            "visibility": weather.visibility,
            "temperature": weather.temperature,
            "condition": weather.weather_condition,
            "timestamp": weather.timestamp
        }


# Singleton instance
weather_agent = WeatherAgent()
