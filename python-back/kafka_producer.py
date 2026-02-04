"""
Kafka IoT Telemetry Producer
Simulates realistic sensor data for smart infrastructure monitoring
"""

import json
import random
import time
import threading
from datetime import datetime
from dataclasses import dataclass
from typing import Dict, List
from kafka import KafkaProducer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SensorConfig:
    sensor_code: str
    structure_id: str
    sensor_type: str
    topic_name: str
    reading_type: str
    unit: str
    min_value: float
    max_value: float
    normal_range: tuple
    anomaly_threshold: tuple

class IoTTelemetryProducer:
    def __init__(self):
        # Initialize Kafka producer
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda x: json.dumps(x).encode('utf-8'),
            key_serializer=str.encode,
            retries=3,
            retry_backoff_ms=100,
            request_timeout_ms=30000
        )
        
        # Define sensor configurations for 4 structures
        self.sensor_configs = [
            # STRUCTURE_1: Water system sensors
            SensorConfig(
                sensor_code="SENSOR_001",
                structure_id="STRUCTURE_1",
                sensor_type="WATER_METER", 
                topic_name="iot.telemetry.water",
                reading_type="FLOW_RATE",
                unit="L/min",
                min_value=0.0,
                max_value=1000.0,
                normal_range=(50.0, 200.0),
                anomaly_threshold=(10.0, 400.0)
            ),
            SensorConfig(
                sensor_code="SENSOR_002",
                structure_id="STRUCTURE_1",
                sensor_type="PRESSURE_SENSOR",
                topic_name="iot.telemetry.pressure", 
                reading_type="PRESSURE",
                unit="bar",
                min_value=0.0,
                max_value=50.0,
                normal_range=(15.0, 35.0),
                anomaly_threshold=(5.0, 45.0)
            ),
            
            # STRUCTURE_2: Power grid sensors  
            SensorConfig(
                sensor_code="SENSOR_003",
                structure_id="STRUCTURE_2",
                sensor_type="ENERGY_METER",
                topic_name="iot.telemetry.energy",
                reading_type="VOLTAGE",
                unit="V",
                min_value=200.0,
                max_value=250.0,
                normal_range=(220.0, 240.0),
                anomaly_threshold=(210.0, 245.0)
            ),
            SensorConfig(
                sensor_code="SENSOR_004", 
                structure_id="STRUCTURE_2",
                sensor_type="ENERGY_METER",
                topic_name="iot.telemetry.energy",
                reading_type="CURRENT",
                unit="A",
                min_value=0.0,
                max_value=100.0,
                normal_range=(10.0, 50.0),
                anomaly_threshold=(5.0, 80.0)
            ),
            
            # STRUCTURE_3: Pipeline pressure sensors
            SensorConfig(
                sensor_code="SENSOR_005",
                structure_id="STRUCTURE_3", 
                sensor_type="PRESSURE_SENSOR",
                topic_name="iot.telemetry.pressure",
                reading_type="PRESSURE",
                unit="psi",
                min_value=0.0,
                max_value=500.0,
                normal_range=(100.0, 300.0),
                anomaly_threshold=(50.0, 450.0)
            ),
            SensorConfig(
                sensor_code="SENSOR_006",
                structure_id="STRUCTURE_3",
                sensor_type="PRESSURE_SENSOR", 
                topic_name="iot.telemetry.temperature",
                reading_type="TEMPERATURE",
                unit="°C",
                min_value=-20.0,
                max_value=80.0,
                normal_range=(15.0, 45.0),
                anomaly_threshold=(0.0, 60.0)
            ),
            
            # STRUCTURE_4: Bridge vibration sensors
            SensorConfig(
                sensor_code="SENSOR_007",
                structure_id="STRUCTURE_4",
                sensor_type="VIBRATION_SENSOR",
                topic_name="iot.telemetry.vibration", 
                reading_type="VIBRATION",
                unit="mm/s",
                min_value=0.0,
                max_value=50.0,
                normal_range=(0.5, 5.0),
                anomaly_threshold=(0.1, 15.0)
            ),
            SensorConfig(
                sensor_code="SENSOR_008",
                structure_id="STRUCTURE_4",
                sensor_type="TEMPERATURE_SENSOR",
                topic_name="iot.telemetry.temperature",
                reading_type="TEMPERATURE", 
                unit="°C",
                min_value=-30.0,
                max_value=70.0,
                normal_range=(10.0, 40.0),
                anomaly_threshold=(-10.0, 55.0)
            )
        ]
        
        self.running = False
        self.threads = []
        
    def generate_realistic_value(self, config: SensorConfig, previous_value: float = None) -> float:
        """Generate realistic sensor values with drift patterns"""
        
        # If no previous value, start in normal range
        if previous_value is None:
            previous_value = random.uniform(*config.normal_range)
        
        # Add realistic drift/noise based on sensor type
        if config.reading_type == "FLOW_RATE":
            # Water flow has gradual changes with occasional spikes
            drift = random.uniform(-5.0, 5.0)
            if random.random() < 0.05:  # 5% chance of anomaly
                drift = random.uniform(-50.0, 100.0)  # Burst or blockage
                
        elif config.reading_type == "PRESSURE":
            # Pressure changes gradually but can drop suddenly
            drift = random.uniform(-2.0, 2.0)
            if random.random() < 0.08:  # 8% chance of anomaly
                drift = random.uniform(-30.0, 10.0)  # Pressure drop more likely
                
        elif config.reading_type == "VOLTAGE":
            # Voltage should be stable with occasional spikes
            drift = random.uniform(-1.0, 1.0)
            if random.random() < 0.06:  # 6% chance of anomaly
                drift = random.uniform(-20.0, 25.0)  # Voltage spike/drop
                
        elif config.reading_type == "CURRENT":
            # Current varies with load
            drift = random.uniform(-3.0, 3.0)
            if random.random() < 0.07:  # 7% chance of anomaly
                drift = random.uniform(-10.0, 40.0)  # Overload more likely
                
        elif config.reading_type == "VIBRATION":
            # Vibration has baseline noise with occasional bursts
            drift = random.uniform(-0.2, 0.2)
            if random.random() < 0.10:  # 10% chance of anomaly
                drift = random.uniform(2.0, 10.0)  # Vibration burst
                
        elif config.reading_type == "TEMPERATURE":
            # Temperature changes slowly
            drift = random.uniform(-0.5, 0.5)
            if random.random() < 0.04:  # 4% chance of anomaly
                drift = random.uniform(-10.0, 15.0)  # Temperature spike
        else:
            drift = random.uniform(-1.0, 1.0)
            
        new_value = previous_value + drift
        
        # Clamp to physical limits
        new_value = max(config.min_value, min(config.max_value, new_value))
        
        return round(new_value, 2)
    
    def create_telemetry_message(self, config: SensorConfig, value: float) -> dict:
        """Create standardized telemetry message"""
        return {
            "sensorCode": config.sensor_code,
            "structureId": config.structure_id,
            "readingType": config.reading_type,
            "value": value,
            "unit": config.unit,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "topicName": config.topic_name,
            "metadata": {
                "sensorType": config.sensor_type,
                "isAnomaly": value < config.anomaly_threshold[0] or value > config.anomaly_threshold[1]
            }
        }
    
    def produce_sensor_data(self, config: SensorConfig):
        """Producer loop for individual sensor"""
        logger.info(f"🔄 Starting producer for {config.sensor_code} ({config.reading_type})")
        
        previous_value = None
        
        while self.running:
            try:
                # Generate realistic sensor value
                value = self.generate_realistic_value(config, previous_value)
                previous_value = value
                
                # Create message
                message = self.create_telemetry_message(config, value)
                
                # Send to Kafka
                future = self.producer.send(
                    config.topic_name,
                    key=config.sensor_code,
                    value=message
                )
                
                # Log anomalies
                if message["metadata"]["isAnomaly"]:
                    logger.warning(f"🚨 ANOMALY detected: {config.sensor_code} = {value} {config.unit}")
                else:
                    logger.info(f"📊 {config.sensor_code}: {value} {config.unit}")
                
                # Wait 2-5 seconds before next reading
                time.sleep(random.uniform(2.0, 5.0))
                
            except Exception as e:
                logger.error(f"❌ Error producing data for {config.sensor_code}: {e}")
                time.sleep(5.0)  # Wait before retrying
    
    def start(self):
        """Start all sensor producers"""
        if self.running:
            logger.warning("⚠️ Producer already running")
            return
            
        logger.info("🚀 Starting IoT Telemetry Producer")
        logger.info(f"📡 Configured {len(self.sensor_configs)} sensors")
        
        self.running = True
        
        # Start producer thread for each sensor
        for config in self.sensor_configs:
            thread = threading.Thread(
                target=self.produce_sensor_data,
                args=(config,),
                daemon=True,
                name=f"Producer-{config.sensor_code}"
            )
            thread.start()
            self.threads.append(thread)
        
        logger.info(f"✅ Started {len(self.threads)} sensor producers")
    
    def stop(self):
        """Stop all producers gracefully"""
        if not self.running:
            return
            
        logger.info("🛑 Stopping IoT Telemetry Producer")
        self.running = False
        
        # Wait for threads to complete
        for thread in self.threads:
            thread.join(timeout=2.0)
        
        # Close Kafka producer
        self.producer.flush()
        self.producer.close()
        
        logger.info("✅ Producer stopped")

def main():
    """Main entry point"""
    producer = IoTTelemetryProducer()
    
    try:
        producer.start()
        
        logger.info("📻 Producer running. Press Ctrl+C to stop...")
        
        # Keep main thread alive
        while True:
            time.sleep(1.0)
            
    except KeyboardInterrupt:
        logger.info("📴 Keyboard interrupt received")
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
    finally:
        producer.stop()

if __name__ == "__main__":
    main()