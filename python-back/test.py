import torch
from PIL import Image as PILImage
from transformers import AutoImageProcessor, SiglipForImageClassification

MODEL_IDENTIFIER = r"Ateeqq/ai-vs-human-image-detector"

# Device: Use GPU if available, otherwise CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Load Model and Processor
try:
    print(f"Loading processor from: {MODEL_IDENTIFIER}")
    processor = AutoImageProcessor.from_pretrained(MODEL_IDENTIFIER)

    print(f"Loading model from: {MODEL_IDENTIFIER}")
    model = SiglipForImageClassification.from_pretrained(MODEL_IDENTIFIER)
    model.to(device)
    model.eval()
    print("Model and processor loaded successfully.")

except Exception as e:
    print(f"Error loading model or processor: {e}")
    exit()

# Load and Preprocess the Image

IMAGE_PATH = r"./images.jpg" 
try:
    print(f"Loading image: {IMAGE_PATH}")
    image = PILImage.open(IMAGE_PATH).convert("RGB")
except FileNotFoundError:
    print(f"Error: Image file not found at {IMAGE_PATH}")
    exit()
except Exception as e:
    print(f"Error opening image: {e}")
    exit()

print("Preprocessing image...")
# Use the processor to prepare the image for the model
inputs = processor(images=image, return_tensors="pt").to(device)

# Perform Inference
print("Running inference...")
with torch.no_grad(): # Disable gradient calculations for inference
    outputs = model(**inputs)
    logits = outputs.logits

# Interpret the Results
# Get the index of the highest logit score -> this is the predicted class ID
predicted_class_idx = logits.argmax(-1).item()

# Use the model's config to map the ID back to the label string ('ai' or 'hum')
predicted_label = model.config.id2label[predicted_class_idx]

# Optional: Get probabilities using softmax
probabilities = torch.softmax(logits, dim=-1)
predicted_prob = probabilities[0, predicted_class_idx].item()

print("-" * 30)
print(f"Image: {IMAGE_PATH}")
print(f"Predicted Label: {predicted_label}")
print(f"Confidence Score: {predicted_prob:.4f}")
print("-" * 30)

# You can also print the scores for all classes:
print("Scores per class:")
for i, label in model.config.id2label.items():
    print(f"  - {label}: {probabilities[0, i].item():.4f}")