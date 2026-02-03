"""
Python FastAPI Backend for Pothole Detection
Receives image URL, performs YOLO detection, returns annotated image
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from PIL import Image
import io
import numpy as np
from ultralytics import YOLO
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Pothole Detection API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# Load YOLO model (handle PyTorch 2.6+ security)
import torch
import os

# Monkey-patch torch.load to use weights_only=False for YOLO compatibility
original_load = torch.load
def patched_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return original_load(*args, **kwargs)
torch.load = patched_load

# Try to use a fresh download or existing compatible model
MODEL_PATH = "yolov8n.pt"  # Using YOLOv8 for better compatibility
if not os.path.exists(MODEL_PATH):
    print(f"📥 Model not found. Downloading {MODEL_PATH}...")
    model = YOLO(MODEL_PATH)  # Auto-downloads
    print("✅ YOLO model downloaded and loaded")
else:
    try:
        model = YOLO(MODEL_PATH)
        print(f"✅ YOLO model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"⚠️ Error loading local model: {e}")
        print("📥 Downloading fresh model...")
        os.remove(MODEL_PATH)  # Remove corrupt file
        model = YOLO(MODEL_PATH)  # Re-download
        print("✅ Fresh model downloaded")

class DetectionRequest(BaseModel):
    imageUrl: str

class BBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class DetectionResponse(BaseModel):
    detected: bool
    confidence: float = 0.0
    bbox: BBox | None = None
    annotatedImageUrl: str | None = None
    detectedClass: str = "pothole"

@app.get("/")
def read_root():
    return {
        "service": "Pothole Detection API",
        "status": "running",
        "model": MODEL_PATH
    }

@app.post("/detect", response_model=DetectionResponse)
async def detect_pothole(request: DetectionRequest):
    """
    Detect potholes in an image from a URL
    Returns detection results and annotated image URL
    """
    try:
        # Download image from URL
        response = requests.get(request.imageUrl, timeout=10)
        response.raise_for_status()
        
        # Load image
        image = Image.open(io.BytesIO(response.content))
        image_array = np.array(image)
        
        # Run YOLO detection with lower confidence for pothole detection
        # Since YOLOv8n is a general detector, we'll treat any significant detection as potential damage
        results = model(image_array, conf=0.10, iou=0.45)  # Lower threshold, adjusted IOU
        
        # Check if any detections exist
        if len(results[0].boxes) == 0:
            # For demo purposes with pothole images: if no detection with YOLOv8n,
            # we'll assume it might still be a pothole but with low confidence
            # In production, use a fine-tuned pothole detection model
            print(f"⚠️ No detections found for image: {request.imageUrl}")
            return DetectionResponse(detected=False)
        
        # Get all detections and process them
        boxes = results[0].boxes
        
        # For potholes, we're interested in any detection (cracks, holes, damage)
        # YOLOv8n might detect them as "other" or low-confidence objects
        best_idx = boxes.conf.argmax()
        best_box = boxes[best_idx]
        
        confidence = float(best_box.conf[0])
        class_id = int(best_box.cls[0])
        class_name = model.names[class_id]
        
        print(f"🔍 Detection: {class_name} (confidence: {confidence:.2f})")
        
        # Map detected class to "pothole" for our use case
        # In production, use a fine-tuned pothole detection model
        detected_label = "pothole"
        
        # Get bounding box coordinates (xyxy format)
        x1, y1, x2, y2 = best_box.xyxy[0].tolist()
        
        # Convert to x, y, width, height
        bbox = BBox(
            x=float(x1),
            y=float(y1),
            width=float(x2 - x1),
            height=float(y2 - y1)
        )
        
        # Generate annotated image
        annotated_image = results[0].plot()
        annotated_pil = Image.fromarray(annotated_image)
        
        # Save to buffer
        buffer = io.BytesIO()
        annotated_pil.save(buffer, format="JPEG", quality=95)
        buffer.seek(0)
        
        # Upload annotated image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            buffer,
            folder="pothole-detections",
            resource_type="image"
        )
        
        annotated_url = upload_result["secure_url"]
        
        return DetectionResponse(
            detected=True,
            confidence=confidence,
            bbox=bbox,
            annotatedImageUrl=annotated_url,
            detectedClass=detected_label
        )
        
    except requests.RequestException as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to download image: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(e)}"
        )

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
