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
import logging
import sys
import traceback

# Configure comprehensive logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('detection.log', mode='a')
    ]
)
logger = logging.getLogger(__name__)

# ⚠️ FIX: Patch torch.load for PyTorch 2.6+ compatibility
original_load = torch.load
def patched_load(*args, **kwargs):
    kwargs.setdefault('weights_only', False)
    return original_load(*args, **kwargs)
torch.load = patched_load

# Load environment variables
load_dotenv()
logger.info("🔧 Environment variables loaded")

app = FastAPI(title="Pothole Detection API")
logger.info("🚀 FastAPI app initialized")

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
logger.info("🌐 CORS middleware configured")

# -------------------------
# Cloudinary Config
# -------------------------
try:
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    )
    logger.info("☁️ Cloudinary configured successfully")
    logger.info(f"   Cloud name: {os.getenv('CLOUDINARY_CLOUD_NAME')}")
except Exception as e:
    logger.error(f"❌ Cloudinary configuration failed: {e}")
    logger.error(f"   Full traceback: {traceback.format_exc()}")
    raise

# -------------------------
# YOLO MODEL AUTO DOWNLOAD
# -------------------------
MODEL_PATH = "best.pt"
MODEL_URL = "https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt"
DEVICE = "cpu"

def download_model():
    logger.info("⬇️ Downloading pothole YOLO model...")
    try:
        r = requests.get(MODEL_URL, stream=True, timeout=300)
        r.raise_for_status()
        with open(MODEL_PATH, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                f.write(chunk)
        logger.info("✅ Model downloaded successfully")
    except Exception as e:
        logger.error(f"❌ Model download failed: {e}")
        logger.error(f"   Full traceback: {traceback.format_exc()}")
        raise

# Download if missing
if not os.path.exists(MODEL_PATH):
    logger.warning("⚠️ Model file not found, downloading...")
    download_model()
else:
    logger.info(f"📁 Using existing model file: {MODEL_PATH}")

# Load model
try:
    logger.info("📥 Loading YOLO pothole model...")
    model = YOLO(MODEL_PATH)
    model.to(DEVICE)
    logger.info(f"✅ Model loaded successfully on device: {DEVICE}")
    logger.info(f"   Model classes: {model.names}")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    logger.error(f"   Full traceback: {traceback.format_exc()}")
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
    logger.info(f"🔍 Starting detection for image: {request.imageUrl}")
    
    try:
        # 1. Download image
        logger.debug("📥 Step 1: Downloading image...")
        try:
            response = requests.get(request.imageUrl, timeout=15)
            response.raise_for_status()
            logger.info(f"✅ Image downloaded successfully. Size: {len(response.content)} bytes")
            logger.debug(f"   Content type: {response.headers.get('content-type')}")
        except Exception as e:
            logger.error(f"❌ Image download failed: {e}")
            logger.error(f"   URL: {request.imageUrl}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(400, f"Image download failed: {str(e)}")

        # 2. Load and convert image
        logger.debug("🖼️ Step 2: Loading and converting image...")
        try:
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            image_array = np.array(image)
            logger.info(f"✅ Image loaded. Dimensions: {image.size}, Array shape: {image_array.shape}")
        except Exception as e:
            logger.error(f"❌ Image processing failed: {e}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(400, f"Image processing failed: {str(e)}")

        # 3. Run YOLO detection
        logger.debug("🤖 Step 3: Running YOLO prediction...")
        try:
            results = model.predict(
                image_array,
                device=DEVICE,
                conf=0.20,
                verbose=False
            )
            logger.info(f"✅ YOLO prediction completed. Results count: {len(results)}")
            if len(results) > 0:
                logger.debug(f"   Detections in result 0: {len(results[0].boxes)}")
        except Exception as e:
            logger.error(f"❌ YOLO prediction failed: {e}")
            logger.error(f"   Input shape: {image_array.shape}")
            logger.error(f"   Input dtype: {image_array.dtype}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(500, f"Model prediction failed: {str(e)}")

        # 4. Process detection results
        logger.debug("📊 Step 4: Processing detection results...")
        if len(results[0].boxes) == 0:
            logger.info("⚠️ No potholes detected")
            return DetectionResponse(detected=False)

        boxes = results[0].boxes
        logger.info(f"🎯 Found {len(boxes)} detections")

        # Pick best detection
        best_idx = boxes.conf.argmax()
        best_box = boxes[best_idx]

        confidence = float(best_box.conf[0])
        class_id = int(best_box.cls[0])
        class_name = results[0].names[class_id]

        logger.info(f"🔍 Best detection: {class_name} (confidence: {confidence:.2f})")

        # 5. Extract bounding box
        logger.debug("📐 Step 5: Extracting bounding box...")
        try:
            x1, y1, x2, y2 = best_box.xyxy[0].tolist()
            bbox = BBox(
                x=float(x1),
                y=float(y1),
                width=float(x2 - x1),
                height=float(y2 - y1),
            )
            logger.debug(f"   BBox: x={x1:.1f}, y={y1:.1f}, w={x2-x1:.1f}, h={y2-y1:.1f}")
        except Exception as e:
            logger.error(f"❌ Bounding box extraction failed: {e}")
            logger.error(f"   Box data: {best_box}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(500, f"Bounding box extraction failed: {str(e)}")

        # 6. Generate annotated image
        logger.debug("🎨 Step 6: Generating annotated image...")
        try:
            annotated_img = results[0].plot()
            annotated_pil = Image.fromarray(annotated_img)
            logger.debug(f"   Annotated image shape: {annotated_img.shape}")
            logger.debug(f"   PIL image size: {annotated_pil.size}")
        except Exception as e:
            logger.error(f"❌ Image annotation failed: {e}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(500, f"Image annotation failed: {str(e)}")

        # 7. Convert to buffer
        logger.debug("💾 Step 7: Converting image to buffer...")
        try:
            buffer = io.BytesIO()
            annotated_pil.save(buffer, format="JPEG", quality=95)
            buffer.seek(0)
            buffer_size = len(buffer.getvalue())
            logger.debug(f"   Buffer size: {buffer_size} bytes")
        except Exception as e:
            logger.error(f"❌ Buffer conversion failed: {e}")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(500, f"Buffer conversion failed: {str(e)}")

        # 8. Upload to Cloudinary
        logger.debug("☁️ Step 8: Uploading to Cloudinary...")
        try:
            upload = cloudinary.uploader.upload(
                buffer,
                folder="pothole-detections",
                resource_type="image"
            )
            annotated_url = upload["secure_url"]
            logger.info(f"✅ Cloudinary upload successful: {annotated_url}")
            logger.debug(f"   Upload response keys: {list(upload.keys())}")
        except Exception as e:
            logger.error(f"❌ Cloudinary upload failed: {e}")
            logger.error(f"   Buffer size: {buffer_size} bytes")
            logger.error(f"   Full traceback: {traceback.format_exc()}")
            raise HTTPException(500, f"Cloudinary upload failed: {str(e)}")

        # 9. Return successful response
        logger.info("🎉 Detection completed successfully!")
        return DetectionResponse(
            detected=True,
            confidence=confidence,
            bbox=bbox,
            annotatedImageUrl=annotated_url,
            detectedClass="pothole"
        )

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"💥 Unexpected error in detect_pothole: {e}")
        logger.error(f"   Request URL: {request.imageUrl}")
        logger.error(f"   Full traceback: {traceback.format_exc()}")
        raise HTTPException(500, f"Detection failed: {str(e)}")


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}


# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting FastAPI server...")
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)