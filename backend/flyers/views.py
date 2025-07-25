from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,  IsAdminUser
from rest_framework.decorators import permission_classes


from .models import Country, Region, Flyer, Product
from .serializers import CountrySerializer, RegionSerializer, FlyerSerializer, ProductSerializer, StoreWithFlyersSerializer
import json
import base64
import openai
from openai import OpenAI
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProviderApplicationSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import ProviderApplication
from rest_framework.views import APIView


from rest_framework import generics
from rest_framework.generics import ListAPIView
from .models import Store
from .serializers import StoreSerializer

class StoreListView(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class FlyersByStoreView(APIView):
    def get(self, request, store_name):
        flyers = Flyer.objects.filter(store__iexact=store_name)
        serializer = FlyerSerializer(flyers, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def flyers_by_store_id(request, store_id):
    flyers = Flyer.objects.filter(store__id=store_id)
    serializer = FlyerSerializer(flyers, many=True)
    return Response(serializer.data)

@csrf_exempt
def become_provider(request):
    if request.method == "POST":
        name = request.POST.get("full_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        gender = request.POST.get("gender")
        company_name = request.POST.get("company_name")
        address = request.POST.get("address")
        gst_number = request.POST.get("gst_number")
        
        
        document = request.FILES.get("document")

        if not all([name, email, phone, company_name]):
            return JsonResponse({"message": "Missing required fields."}, status=400)

        ProviderApplication.objects.create(
            full_name=name,
            email=email,
            phone=phone,
            gender=gender,
            company_name=company_name,
            address=address,
            gst_number=gst_number,
            document=document,
        )
        return JsonResponse({"message": "Application submitted!"})

    return JsonResponse({"message": "Invalid request"}, status=400)


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
    
class RegionList(generics.ListAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

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



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])  # Required for file upload
def submit_provider_application(request):
    serializer = ProviderApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Application submitted successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt


def become_provider(request):
    if request.method == "POST":
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        gender = request.POST.get('gender')
        company_name = request.POST.get('company_name')
        address = request.POST.get('address')
        gst_number = request.POST.get('gst_number')
        document = request.FILES.get('document')

        ProviderApplication.objects.create(
            full_name=full_name,
            email=email,
            phone=phone,
            gender=gender,
            company_name=company_name,
            address=address,
            gst_number=gst_number,
            document=document
        )
        return JsonResponse({'message': 'Application submitted successfully!'})
    else:
        return JsonResponse({'error': 'Only POST allowed'}, status=405)


class BrochuresByStoreView(APIView):
    def get(self, request, store):
        brochures = Brochure.objects.filter(store__iexact=store)
        serializer = BrochureSerializer(brochures, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_flyer(request):
    serializer = FlyerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors,status=400)  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def flyers_by_provider(request):
    try:
        store = Store.objects.get(user=request.user)
        flyers = Flyer.objects.filter(store=store)
        serializer = FlyerSerializer(flyers, many=True)
        return Response(serializer.data)
    except Store.DoesNotExist:
        return Response({'error': 'No store associated with this provider'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def stores_with_flyers(request):
    stores = Store.objects.all()
    data = []

    for store in stores:
        flyers = Flyer.objects.filter(store=store)
        flyer_serializer = FlyerSerializer(flyers, many=True, context={'request': request})
        data.append({
            'id': store.id,
            'name': store.name,
            'logo': request.build_absolute_uri(store.logo.url) if store.logo else None,
            'flyers': flyer_serializer.data
        })

    return Response(data)
