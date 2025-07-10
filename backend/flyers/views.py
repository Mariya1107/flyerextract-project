from rest_framework import generics
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import Country, Region, Flyer, Product
from .serializers import CountrySerializer, RegionSerializer, FlyerSerializer, ProductSerializer
import json
import base64
import openai
from openai import OpenAI
from django.conf import settings

# Set OpenAI API key
client = OpenAI(api_key=settings.OPENAI_API_KEY)


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

# --------------------------- GPT-4 Vision Extraction ---------------------------

def extract_with_gpt(image_file):
    import traceback
    import json
    print("🔍 Starting GPT Vision extraction...")

    image_bytes = image_file.read()
    image_file.seek(0)

    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract the product name and price from this image. Respond with only JSON like: {\"name\": \"Product Name\", \"price\": 99.99}"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=150,
        )

        content = response.choices[0].message.content
        print("✅ GPT Response:\n", content)

        # 🧼 Remove markdown formatting if present
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").replace("json", "").strip()

        parsed = json.loads(cleaned)
        return parsed.get("name", "Unknown Product"), parsed.get("price", "0")

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"GPT Vision error: {str(e)}")


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
        name, price = extract_with_gpt(image_file)
    except Exception as e:
        import traceback
        print("❌ Error during product upload:")
        traceback.print_exc()
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


# --------------------------- Search Products API ---------------------------

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(name__icontains=query)
    else:
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
