from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from rest_framework import generics, status
from rest_framework.decorators import (
    api_view,
    parser_classes,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import get_user_model
User = get_user_model()

from .models import (
    Country,
    Region,
    Store,
    Flyer,
    Product,
    PendingFlyer,
    ProviderApplication,
)
from .serializers import (
    CountrySerializer,
    RegionSerializer,
    FlyerSerializer,
    ProductSerializer,
    StoreSerializer,
    StoreWithPhoneSerializer,
    StoreWithFlyersSerializer,
    PendingFlyerSerializer,
    ProviderApplicationSerializer,
)

import base64, json, traceback
from openai import OpenAI
from django.conf import settings

# OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)


# --------------------------- COUNTRY / REGION APIs ---------------------------

class CountryList(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class RegionList(generics.ListAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class RegionListByCountry(generics.ListAPIView):
    serializer_class = RegionSerializer

    def get_queryset(self):
        return Region.objects.filter(country__slug=self.kwargs["country_slug"])


# --------------------------- STORE / FLYER APIs ---------------------------

class StoreListView(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class FlyersByStoreView(APIView):
    def get(self, request, store_slug):
        flyers = Flyer.objects.filter(store__slug=store_slug)
        serializer = FlyerSerializer(flyers, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def flyers_by_store_slug(request, store_slug):
    flyers = Flyer.objects.filter(store__slug=store_slug)
    serializer = FlyerSerializer(flyers, many=True)
    return Response(serializer.data)


class FlyerListByRegion(generics.ListAPIView):
    serializer_class = FlyerSerializer

    def get_queryset(self):
        return Flyer.objects.filter(region__slug=self.kwargs["region_slug"])


class FlyerListAll(generics.ListAPIView):
    queryset = Flyer.objects.all()
    serializer_class = FlyerSerializer


# --------------------------- FLYER DETAIL ---------------------------

class FlyerDetail(generics.RetrieveAPIView):
    queryset = Flyer.objects.all()
    serializer_class = FlyerSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "flyer_slug"


# --------------------------- PRODUCTS ---------------------------

class ProductListByFlyer(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(flyer__slug=self.kwargs["flyer_slug"]).select_related(
            "flyer__store"
        )


@api_view(["GET"])
def search_products(request):
    query = request.GET.get("q", "")
    products = Product.objects.filter(name__icontains=query) if query else Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# --------------------------- GPT PRODUCT EXTRACTION ---------------------------

def extract_with_gpt(image_file):
    print("🔍 Starting GPT Vision extraction...")

    image_bytes = image_file.read()
    image_file.seek(0)
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Extract the product name and price from this image. "
                                'Always respond in JSON format like: {"name": "Product Name", "price": 99.99}. '
                                "Translate the product name to English if it's in another language."
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            max_tokens=150,
        )

        content = response.choices[0].message.content
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").replace("json", "").strip()

        parsed = json.loads(cleaned)
        return parsed.get("name", "Unknown Product"), parsed.get("price", "0")

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"GPT Vision error: {str(e)}")


@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_cropped_product(request):
    flyer_slug = request.data.get("flyer_slug")
    image_file = request.FILES.get("image")

    if not flyer_slug or not image_file:
        return Response({"error": "Missing image or flyer_slug."}, status=400)

    try:
        flyer = Flyer.objects.get(slug=flyer_slug)
    except Flyer.DoesNotExist:
        return Response({"error": "Flyer not found."}, status=404)

    try:
        name, price = extract_with_gpt(image_file)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": f"OCR processing failed: {str(e)}"}, status=500)

    product = Product.objects.create(flyer=flyer, name=name, price=price, image=image_file)

    return Response(
        {"success": True, "product_id": product.id, "name": name, "price": price}
    )


# --------------------------- PROVIDER APPLICATION ---------------------------

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_provider_application(request):
    serializer = ProviderApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Application submitted successfully"}, status=201)
    return Response(serializer.errors, status=400)


@csrf_exempt
def become_provider(request):
    if request.method == "POST":
        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        gender = request.POST.get("gender")
        company_name = request.POST.get("company_name")
        address = request.POST.get("address")
        gst_number = request.POST.get("gst_number")
        document = request.FILES.get("document")

        ProviderApplication.objects.create(
            full_name=full_name,
            email=email,
            phone=phone,
            gender=gender,
            company_name=company_name,
            address=address,
            gst_number=gst_number,
            document=document,
        )
        return JsonResponse({"message": "Application submitted successfully!"})
    return JsonResponse({"error": "Only POST allowed"}, status=405)


# --------------------------- FLYER UPLOAD & MANAGEMENT ---------------------------

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_flyer(request):
    serializer = FlyerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def flyers_by_provider(request):
    try:
        store = Store.objects.get(provider=request.user)
        flyers = Flyer.objects.filter(store=store)
        serializer = FlyerSerializer(flyers, many=True)
        return Response(serializer.data)
    except Store.DoesNotExist:
        return Response({"error": "No store associated with this provider"}, status=404)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_flyer(request):
    serializer = FlyerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_flyer(request, flyer_slug):
    try:
        flyer = Flyer.objects.get(slug=flyer_slug)
        flyer.delete()
        return Response({"message": "Flyer deleted successfully"}, status=204)
    except Flyer.DoesNotExist:
        return Response({"error": "Flyer not found"}, status=404)


@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def update_flyer(request, flyer_slug):
    try:
        flyer = Flyer.objects.get(slug=flyer_slug)
    except Flyer.DoesNotExist:
        return Response({"error": "Flyer not found"}, status=404)

    if "pdf" in request.FILES or request.data.get("clear_image") == "true":
        if flyer.image:
            flyer.image.delete(save=False)
        flyer.image = None

    if "image" in request.FILES or request.data.get("clear_pdf") == "true":
        if flyer.pdf:
            flyer.pdf.delete(save=False)
        flyer.pdf = None

    serializer = FlyerSerializer(flyer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Flyer updated successfully"}, status=200)
    return Response(serializer.errors, status=400)


# --------------------------- PENDING FLYERS ---------------------------

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_pending_flyer(request):
    serializer = PendingFlyerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Flyer submitted for approval"}, status=201)
    return Response(serializer.errors, status=400)


class PendingFlyerListView(generics.ListAPIView):
    queryset = PendingFlyer.objects.all()
    serializer_class = PendingFlyerSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def approve_pending_flyer(request, flyer_slug):
    try:
        pending = PendingFlyer.objects.get(slug=flyer_slug)
        flyer = Flyer.objects.create(
            store=pending.store,
            region=pending.region,
            title=pending.title,
            pdf=pending.pdf,
            image=pending.image,
            expires_at=pending.expires_at,
        )
        pending.delete()
        return Response({"message": "Flyer approved and published"}, status=201)
    except PendingFlyer.DoesNotExist:
        return Response({"error": "Pending flyer not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def reject_pending_flyer(request, flyer_slug):
    try:
        flyer = PendingFlyer.objects.get(slug=flyer_slug)
        flyer.delete()
        return Response({"message": "Flyer rejected and deleted"})
    except PendingFlyer.DoesNotExist:
        return Response({"error": "Pending flyer not found"}, status=404)


# --------------------------- DASHBOARD ---------------------------

@api_view(["GET"])
@permission_classes([IsAdminUser])
def dashboard_counts(request):
    return Response(
        {
            "users": User.objects.count(),
            "providers": Store.objects.count(),
            "flyers": Flyer.objects.count(),
            "pending_flyers": PendingFlyer.objects.count(),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_dashboard_counts(request):
    user = request.user
    store = Store.objects.filter(provider=user).first()
    if not store:
        return Response({"detail": "Store not found for this provider."}, status=404)

    return Response(
        {
            "brochures": Flyer.objects.filter(store=store).count(),
            "products": Product.objects.filter(flyer__store=store).count(),
            "providers": Store.objects.count(),
        }
    )


# --------------------------- SEARCH & UTILITIES ---------------------------

class StoreSearchAPIView(generics.ListAPIView):
    serializer_class = StoreSerializer

    def get_queryset(self):
        query = self.request.query_params.get("search", "").strip()
        if not query:
            return Store.objects.none()

        return Store.objects.filter(
            Q(name__icontains=query)
            | Q(flyer__region__name__icontains=query)
            | Q(flyer__region__country__name__icontains=query)
        ).distinct()


@api_view(["GET"])
def store_by_name(request, name):
    try:
        store = Store.objects.get(slug=name.strip())
    except Store.DoesNotExist:
        return Response({"error": "Store not found"}, status=404)

    serializer = StoreWithPhoneSerializer(store)
    return Response(serializer.data)
