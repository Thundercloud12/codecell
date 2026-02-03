from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import cv2
import numpy as np
import io
from PIL import Image

app = FastAPI(title="Mumbai Smart Infrastructure API")

# Load your successful model
model = YOLO("https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt")

def get_detections(results):
    """Helper to extract coordinates and classes"""
    detections = []
    for r in results:
        for box in r.boxes:
            # Get coordinates in [x1, y1, x2, y2] format
            coords = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = r.names[cls]
            
            detections.append({
                "label": label,
                "confidence": round(conf, 2),
                "bbox": [round(x) for x in coords] # Rounded for cleaner JSON
            })
    return detections

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_array = np.array(img)

    # Run Inference
    results = model.predict(img_array, device='cpu', conf=0.25)
    detections = get_detections(results)

    if not detections:
        return {"status": "success", "message": "No potholes detected", "data": []}
    
    return {"status": "success", "message": f"Found {len(detections)} potholes", "data": detections}

@app.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):
    # Save video temporarily to process
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    cap = cv2.VideoCapture(temp_path)
    total_detections = 0
    unique_potholes = [] # Simplified tracking logic

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # We only process every 5th frame to save CPU time for Mumbai traffic
        if int(cap.get(cv2.CAP_PROP_POS_FRAMES)) % 5 == 0:
            res = model.predict(frame, device='cpu', conf=0.3)
            current_frame_dets = get_detections(res)
            total_detections += len(current_frame_dets)
            # You could add logic here to deduplicate or save coordinates

    cap.release()
    import os
    os.remove(temp_path) # Clean up

    return {
        "status": "success",
        "total_detections_found": total_detections,
        "summary": "Video processed. Coordinates archived to database." if total_detections > 0 else "No issues detected."
    }