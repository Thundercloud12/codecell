from ultralytics import YOLO
import torch

# Force CPU usage to avoid CUDA compatibility issues
device = 'cpu'

model = YOLO("https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt")
model.to(device)

results = model("mumbai.jpeg", device=device)
results[0].show()
