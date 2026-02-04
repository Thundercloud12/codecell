"""
Windows-Compatible FastAPI Backend for Pothole Detection
Auto-downloads YOLO model if missing
Receives image URL, performs detection, returns annotated image URL
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
import torch

# ⚠️ FIX: Patch torch.load for PyTorch 2.6+ compatibility
original_load = torch.load
def patched_load(*args, **kwargs):
    kwargs.setdefault('weights_only', False)
    return original_load(*args, **kwargs)
torch.load = patched_load

# Load environment variables
load_dotenv()

app = FastAPI(title="Pothole Detection API")

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Cloudinary Config
# -------------------------
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# -------------------------
# YOLO MODEL AUTO DOWNLOAD
# -------------------------
MODEL_PATH = "best.pt"
MODEL_URL = "https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt"
DEVICE = "cpu"

def download_model():
    print("⬇️ Downloading pothole YOLO model...")
    r = requests.get(MODEL_URL, stream=True)
    r.raise_for_status()
    with open(MODEL_PATH, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024 * 1024):
            f.write(chunk)
    print("✅ Model downloaded successfully")

# Download if missing
if not os.path.exists(MODEL_PATH):
    download_model()

# Load model
try:
    print("📥 Loading YOLO pothole model...")
    model = YOLO(MODEL_PATH)
    model.to(DEVICE)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    raise


# -------------------------
# API Models
# -------------------------
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


# -------------------------
# ROUTES
# -------------------------
@app.get("/")
def root():
    return {
        "service": "Pothole Detection API",
        "status": "running",
        "device": DEVICE,
        "model_file": MODEL_PATH,
    }


@app.post("/detect", response_model=DetectionResponse)
async def detect_pothole(request: DetectionRequest):

    try:
        # Download image
        response = requests.get(request.imageUrl, timeout=15)
        response.raise_for_status()

        # Load image safely
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        image_array = np.array(image)

        # Run YOLO detection
        results = model.predict(
            image_array,
            device=DEVICE,
            conf=0.20,  # Lowered threshold for better detection
            verbose=False
        )

        # No detections
        if len(results[0].boxes) == 0:
            print("⚠️ No potholes detected")
            return DetectionResponse(detected=False)

        boxes = results[0].boxes

        # Pick best detection
        best_idx = boxes.conf.argmax()
        best_box = boxes[best_idx]

        confidence = float(best_box.conf[0])
        class_id = int(best_box.cls[0])
        class_name = results[0].names[class_id]

        print(f"🔍 Detection: {class_name} (confidence: {confidence:.2f})")

        # Bounding box
        x1, y1, x2, y2 = best_box.xyxy[0].tolist()

        bbox = BBox(
            x=float(x1),
            y=float(y1),
            width=float(x2 - x1),
            height=float(y2 - y1),
        )

        # Generate annotated image
        annotated_img = results[0].plot()
        annotated_pil = Image.fromarray(annotated_img)

        buffer = io.BytesIO()
        annotated_pil.save(buffer, format="JPEG", quality=95)
        buffer.seek(0)

        # Upload to Cloudinary
        upload = cloudinary.uploader.upload(
            buffer,
            folder="pothole-detections",
            resource_type="image"
        )

        annotated_url = upload["secure_url"]

        return DetectionResponse(
            detected=True,
            confidence=confidence,
            bbox=bbox,
            annotatedImageUrl=annotated_url,
            detectedClass="pothole"
        )

    except requests.RequestException as e:
        raise HTTPException(400, f"Image download failed: {str(e)}")

    except Exception as e:
        raise HTTPException(500, f"Detection failed: {str(e)}")


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}


# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)