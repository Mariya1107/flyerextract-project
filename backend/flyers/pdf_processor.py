import os
import io
import re
import cv2
import base64
import pytesseract
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image as PILImage
from django.core.files.base import ContentFile
from .models import Product
from inference_sdk import InferenceHTTPClient
import string

# ✅ Tesseract for OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ✅ Roboflow Config
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="tVRjQHxt4qc8CTIFVIBk"
)
MODEL_ID = "products-in-sales-flyers/3"

def sanitize_filename(name):
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    return ''.join(c for c in name if c in valid_chars).replace(" ", "_")[:30]

def process_flyer_pdf(flyer_pdf_path, flyer_instance, poppler_path=None):
    output_dir = os.path.join(os.getcwd(), "flyer_pages")
    os.makedirs(output_dir, exist_ok=True)

    print("📄 Converting PDF to image(s)...")
    pages = convert_from_path(flyer_pdf_path, poppler_path=poppler_path)

    for i, page in enumerate(pages):
        resized_page = page.resize((1024, int(page.height * 1024 / page.width)))
        img_path = os.path.join(output_dir, f"page_{i}.jpg")
        resized_page.save(img_path, "JPEG")
        print(f"✅ Saved: {img_path}")

        with open(img_path, "rb") as f:
            base64_img = base64.b64encode(f.read()).decode("utf-8")

        try:
            print("🔍 Sending to Roboflow...")
            result = CLIENT.infer(base64_img, model_id=MODEL_ID)
        except Exception as e:
            print(f"❌ Roboflow error: {e}")
            continue

        img_cv = cv2.imread(img_path)
        if "predictions" not in result or not result["predictions"]:
            print("⚠ No predictions found.")
            continue

        for pred in result["predictions"]:
            x = int(pred["x"] - pred["width"] / 2)
            y = int(pred["y"] - pred["height"] / 2)
            w = int(pred["width"])
            h = int(pred["height"])

            crop = img_cv[y:y + h, x:x + w]
            resized = cv2.resize(crop, (300, 300))

            image_pil = PILImage.fromarray(cv2.cvtColor(resized, cv2.COLOR_BGR2RGB))
            text = pytesseract.image_to_string(image_pil)
            lines = text.split("\n")

            name = None
            price = None

            for line in lines:
                line = line.strip()
                if not name and len(line) > 5:
                    name = line
                if not price:
                    price_match = re.search(r"\d+[.,]?\d*", line)
                    if price_match:
                        try:
                            price = float(price_match.group().replace(",", "").strip())
                        except:
                            price = 0.0

            if name and price:
                buf = io.BytesIO()
                image_pil.save(buf, format="JPEG")
                image_file = ContentFile(buf.getvalue(), name=f"{sanitize_filename(name)}.jpg")

                Product.objects.create(
                    flyer=flyer_instance,
                    name=name,
                    price=price,
                    image=image_file
                )

                print(f"🛒 Product: {name} | 💰 Price: {price}")
            else:
                print("⛔ Skipped: Missing name or price")

    print("✅ Extraction complete.")