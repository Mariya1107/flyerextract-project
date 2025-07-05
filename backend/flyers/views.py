from rest_framework import generics
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import Country, Region, Flyer, Product
from .serializers import CountrySerializer, RegionSerializer, FlyerSerializer, ProductSerializer

import pytesseract
import numpy as np
import cv2
import re
from fuzzywuzzy import process
import string

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# --------------------------- COUNTRY / REGION / FLYER APIs ---------------------------

class CountryList(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class RegionListByCountry(generics.ListAPIView):
    serializer_class = RegionSerializer

    def get_queryset(self):
        return Region.objects.filter(country_id=self.kwargs['country_id'])

class FlyerListByRegion(generics.ListAPIView):
    serializer_class = FlyerSerializer

    def get_queryset(self):
        return Flyer.objects.filter(region_id=self.kwargs['region_id'])

class FlyerListAll(generics.ListAPIView):
    queryset = Flyer.objects.all()
    serializer_class = FlyerSerializer

class ProductListByFlyer(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(flyer_id=self.kwargs['flyer_id'])

# --------------------------- Clean Noise Helper ---------------------------

def clean_name(raw_words):
    cleaned = []
    for word in raw_words:
        word = word.strip(string.punctuation)
        if re.match(r'^[a-zA-Z][a-zA-Z\-]*$', word):
            cleaned.append(word)
    return cleaned

# --------------------------- OCR Dual-Pass Extraction ---------------------------
def extract_name_price(image_file):
    image_array = np.asarray(bytearray(image_file.read()), dtype=np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image_file.seek(0)

    if img is None:
        return "Unknown Product", "0"

    # ---------- Preprocessing for full image (price) ----------
    def preprocess_full(img):
        resized = cv2.resize(img, None, fx=5, fy=5, interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        contrast = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gray)
        sharpen = cv2.filter2D(contrast, -1, np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]))
        _, thresholded = cv2.threshold(sharpen, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        cv2.imwrite("debug_full.jpg", thresholded)
        return thresholded

    processed_full = preprocess_full(img)
    full_text = pytesseract.image_to_string(processed_full, lang='eng', config='--psm 11')
    print("🧾 Full OCR Text:\n", full_text)

    price = "0"
    price_match = re.search(r'(₹|Rs\.?)\s?(\d{2,5})', full_text)
    if price_match:
        price = price_match.group(2)
    else:
        number_match = re.search(r'\b\d{2,5}\b', full_text)
        if number_match:
            price = number_match.group(0)

    # ---------- Bottom OCR for product name ----------
    def preprocess_bottom(img):
        h = img.shape[0]
        bottom_crop = img[int(h * 0.4):, :]
        resized = cv2.resize(bottom_crop, None, fx=10, fy=10, interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        contrast = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gray)
        sharpen = cv2.filter2D(contrast, -1, np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]))
        _, thresholded = cv2.threshold(sharpen, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        cv2.imwrite("debug_bottom.jpg", thresholded)
        return thresholded

    processed_bottom = preprocess_bottom(img)
    data = pytesseract.image_to_data(
        processed_bottom, lang='eng', config='--psm 11', output_type=pytesseract.Output.DICT
    )
    words = data.get("text", [])
    confidences = data.get("conf", [])
    tops = data.get("top", [])

    # Filter good words: confidence > 40, alphabetic only
    filtered = [
        (word.strip(), top)
        for word, conf, top in zip(words, confidences, tops)
        if word.strip() and conf != '-1' and float(conf) > 60 and word.isalpha()
    ]
    filtered.sort(key=lambda x: x[1])  # sort by vertical order (top)

    clean_words = [w for w, _ in filtered]
    print("🧹 Clean OCR Words:", clean_words)

    # Build longest sequence of clean words
    name = " ".join(clean_words[:5]) if clean_words else "Unknown Product"
    return name.strip(), price


# --------------------------- Upload Product API ---------------------------

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_cropped_product(request):
    flyer_id = request.data.get('flyer_id')
    image_file = request.FILES.get('image')

    if not flyer_id or not image_file:
        return Response({"error": "Missing image or flyer_id."}, status=400)

    try:
        flyer = Flyer.objects.get(id=flyer_id)
    except Flyer.DoesNotExist:
        return Response({"error": "Flyer not found."}, status=404)

    try:
        name, price = extract_name_price(image_file)
    except Exception as e:
        return Response({"error": f"OCR processing failed: {str(e)}"}, status=500)

    product = Product.objects.create(
        flyer=flyer,
        name=name,
        price=price,
        image=image_file
    )

    return Response({
        "success": True,
        "product_id": product.id,
        "name": name,
        "price": price
    })
from fuzzywuzzy import fuzz

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')  # Get the search keyword from query params
    if query:
        # Case-insensitive search for products where the name contains the query anywhere
        products = Product.objects.filter(name__icontains=query)
    else:
        products = Product.objects.all()  # return all if no query

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)