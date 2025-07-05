import os
from pathlib import Path
from pdf2image import convert_from_path
from ultralytics import YOLO
from PIL import Image
import pytesseract

# 🛠️ Set path to Tesseract executable (for Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ========== CONFIGURATION ==========

# Path to your flyer PDF
pdf_path = r"C:\Users\maiya\Downloads\flyer1.pdf"
pdf_path = r"C:\Users\maiya\Downloads\flyer2.pdf"
pdf_path = r"C:\Users\maiya\Downloads\flyer3.pdf"

# Path to Poppler (for pdf2image)
poppler_path = r"C:\Users\maiya\Downloads\Release-24.08.0-0 (1)\poppler-24.08.0\Library\bin"

# YOLOv8 model path
yolo_model = "yolov8n.pt"

# ========== STEP 1: Convert PDF to Image(s) ==========

print("📄 Converting PDF to image...")

images = convert_from_path(pdf_path, poppler_path=poppler_path)
image_paths = []

for i, img in enumerate(images):
    image_path = f"flyer_page_{i}.jpg"
    img.save(image_path, "JPEG")
    image_paths.append(image_path)
    print(f"✅ Saved page {i} as {image_path}")

# ========== STEP 2: Run YOLOv8 on Each Image ==========

print("\n🔍 Running YOLOv8 detection...")

model = YOLO(yolo_model)
pdf_name = Path(pdf_path).stem
output_dir = f"runs/detect/{pdf_name}"

for image_path in image_paths:
    model.predict(
        image_path,
        save=True,
        save_crop=True,
        conf=0.4,
        project="runs/detect",
        name=pdf_name,
        exist_ok=True
    )
    print(f"✅ YOLO processed {image_path} ➜ {output_dir}")

# ========== STEP 3: OCR on Cropped Product Images ==========

print("\n📥 Reading text from cropped product images...")

crop_dir = os.path.join(output_dir, "crops")
if not os.path.exists(crop_dir):
    print("❌ No crops found. Try lowering YOLO confidence or check your flyer layout.")
else:
    for root, _, files in os.walk(crop_dir):
        for file in files:
            if file.endswith(".jpg"):
                crop_path = os.path.join(root, file)
                img = Image.open(crop_path)

                import re

text = pytesseract.image_to_string(img)
lines = text.split("\n")

product_name = None
product_price = None

for line in lines:
    clean_line = line.strip()

    # 🧼 Clean line (ignore noise)
    if not clean_line or len(clean_line) < 3:
        continue

    # ✅ Check for price pattern like ₹55 or 120.00
    if not product_price and (re.search(r'₹\s?\d+(\.\d{1,2})?', clean_line) or re.search(r'\d+\.\d{2}', clean_line)):
        product_price = clean_line

    # ✅ First good line = product name
    if not product_name and re.search(r'[A-Za-z]{3,}', clean_line):
        product_name = clean_line

print(f"\n🧾 OCR for {file}:\n🛒 Product: {product_name or '--'}\n💰 Price: {product_price or '--'}")
