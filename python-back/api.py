"""
Windows-Compatible FastAPI Backend for Pothole Detection
Auto-downloads YOLO model if missing
Receives image URL, performs detection, returns annotated image URL
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
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

# Load YOLO model (handle PyTorch 2.6+ security)
import torch

# Force CPU usage to avoid CUDA errors
torch.set_default_device('cpu')
# Don't set CUDA device - we're using CPU only


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

# Load the fine-tuned pothole detection model from Hugging Face
MODEL_PATH = "https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt"
try:
    print(f"📥 Loading pothole detection model from Hugging Face...")
    model = YOLO(MODEL_PATH)
    # Explicitly move model to CPU
    model.to('cpu')
    print("✅ Pothole detection model loaded successfully on CPU")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    raise


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

        detected_label = "pothole"

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


@app.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):
    """
    Upload a video file and get back a video with pothole detections annotated
    """
    import cv2
    import tempfile
    from pathlib import Path
    
    try:
        # Create temp directory for processing
        temp_dir = tempfile.mkdtemp()
        input_video_path = os.path.join(temp_dir, file.filename)
        output_video_path = os.path.join(temp_dir, f"annotated_{file.filename}")
        
        # Save uploaded video
        contents = await file.read()
        with open(input_video_path, "wb") as f:
            f.write(contents)
        
        print(f"📹 Processing video: {file.filename}")
        
        # Open video
        cap = cv2.VideoCapture(input_video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Define output video codec
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
        
        frame_count = 0
        detection_count = 0
        
        print(f"📊 Video info: {width}x{height} @ {fps}fps, {total_frames} frames")
        
        # Process video frame by frame
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Run YOLO detection on every frame (or every Nth frame for speed)
            # For now, process every frame for accuracy
            results = model(frame, conf=0.25, verbose=False, device='cpu')
            
            # Annotate frame with detections
            annotated_frame = results[0].plot()
            
            # Count detections
            if len(results[0].boxes) > 0:
                detection_count += len(results[0].boxes)
                print(f"  Frame {frame_count}/{total_frames}: {len(results[0].boxes)} potholes detected")
            
            # Write annotated frame to output video
            out.write(annotated_frame)
            
            # Progress indicator every 30 frames
            if frame_count % 30 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"  Progress: {progress:.1f}% ({frame_count}/{total_frames})")
        
        cap.release()
        out.release()
        
        print(f"✅ Video processing complete: {detection_count} potholes detected across {frame_count} frames")
        
        # Upload annotated video to Cloudinary
        print(f"☁️ Uploading annotated video to Cloudinary...")
        upload_result = cloudinary.uploader.upload(
            output_video_path,
            folder="pothole-detections",
            resource_type="video",
            timeout=300  # 5 minute timeout for large videos
        )
        
        annotated_video_url = upload_result["secure_url"]
        
        # Cleanup temp files
        os.remove(input_video_path)
        os.remove(output_video_path)
        os.rmdir(temp_dir)
        
        return {
            "status": "success",
            "message": f"Video processed successfully",
            "data": {
                "total_frames": frame_count,
                "fps": fps,
                "resolution": f"{width}x{height}",
                "total_potholes_detected": detection_count,
                "annotated_video_url": annotated_video_url
            }
        }
        
    except Exception as e:
        # Cleanup on error
        try:
            if 'temp_dir' in locals() and os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir)
        except:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Video processing failed: {str(e)}"
        )

@app.post("/detect/video/stream")
async def detect_video_stream(file: UploadFile = File(...)):
    """
    Stream the annotated video frames in real-time (MJPEG format)
    Returns frames with pothole detections as they are processed
    """
    import cv2
    import tempfile
    from pathlib import Path
    
    async def generate_video_stream():
        temp_dir = None
        try:
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            input_video_path = os.path.join(temp_dir, file.filename)
            
            # Save uploaded video
            contents = await file.read()
            with open(input_video_path, "wb") as f:
                f.write(contents)
            
            # Open video
            cap = cv2.VideoCapture(input_video_path)
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            frame_count = 0
            detection_count = 0
            
            # Stream frames
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Run YOLO detection
                results = model(frame, conf=0.25, verbose=False, device='cpu')
                
                # Annotate frame
                annotated_frame = results[0].plot()
                
                # Count detections
                if len(results[0].boxes) > 0:
                    detection_count += len(results[0].boxes)
                
                # Encode frame to JPEG
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                frame_bytes = buffer.tobytes()
                
                # Yield frame in MJPEG format
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n'
                       b'Content-Length: ' + str(len(frame_bytes)).encode() + b'\r\n\r\n' + 
                       frame_bytes + b'\r\n')
                
                # Add progress data in stream header
                if frame_count % 10 == 0:
                    progress = (frame_count / total_frames) * 100
                    print(f"Streaming: {progress:.1f}% - {detection_count} potholes detected")
            
            cap.release()
            
            # Cleanup
            if temp_dir and os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir)
                
        except Exception as e:
            print(f"Stream error: {e}")
            if temp_dir and os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir)
    
    return StreamingResponse(
        generate_video_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
    
import cv2
import threading
import time
from fastapi.responses import StreamingResponse

# --- SETUP & SAFETY PATCH (Already done above) ---
# torch.load patch already applied

# --- CAMERA STREAM CLASS ---
class CameraStream:
    def __init__(self, source=0):
        self.cap = cv2.VideoCapture(source)
        # Set buffer size to 1 to help reduce hardware-level lag
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        self.ret = False
        self.frame = None
        self.running = True
        
        # Start a background thread to CONSTANTLY read the camera
        self.thread = threading.Thread(target=self._update, daemon=True)
        self.thread.start()

    def _update(self):
        """Continuously grabs the latest frame from the hardware."""
        while self.running:
            self.ret, self.frame = self.cap.read()
            if not self.ret:
                print("Failed to grab frame. Camera might be disconnected.")
                time.sleep(1) # Wait before trying again

    def get_latest_frame(self):
        """Returns only the absolute newest frame."""
        return self.frame

    def stop(self):
        self.running = False
        self.cap.release()

# Global streamer instance
camera = CameraStream(source=0)

# --- 3. INFERENCE LOGIC ---
def generate_detections():
    """
    This loop pulls the newest frame, runs YOLO, and yields it to the browser.
    If YOLO is slow, we simply skip the frames that the background thread
    already replaced.
    """
    while True:
        frame = camera.get_latest_frame()
        
        if frame is None:
            time.sleep(0.01)
            continue

        # Run YOLO on the LATEST frame with CPU device
        # stream=True is used to handle memory better for continuous feeds
        results = model(frame, conf=0.3, verbose=False, device='cpu', stream=True)
        
        # Annotate the frame with boxes
        for result in results:
            annotated_frame = result.plot()
            
            # Encode to JPEG for the web stream
            _, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        # Brief pause to prevent CPU 100% usage if camera is too fast
        time.sleep(0.01)

# --- 4. API ENDPOINTS ---
@app.get("/")
def index():
    return {"status": "Running", "endpoint": "/video/live"}

@app.get("/video/live")
async def video_feed():
    """The URL you visit in your browser to see the live feed."""
    return StreamingResponse(
        generate_detections(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# --- 5. EXECUTION ---
if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}





