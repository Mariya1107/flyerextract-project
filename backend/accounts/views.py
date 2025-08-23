from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from django.utils.text import slugify
from django.utils import timezone

from .models import CustomUser, Cart, CartItem
from .serializers import (
    UserProfileSerializer, RegisterSerializer,
    CartSerializer, CartItemSerializer
)
from flyers.models import Store, Country, Region, ProviderApplication, Flyer, PendingFlyer, Product
from flyers.serializers import (
    StoreSerializer, CountrySerializer, RegionSerializer,
    ProviderApplicationSerializer, FlyerSerializer
)

User = get_user_model()


# ---------------- AUTH + USER ---------------- #

@api_view(['POST'])
def register_user(request):
    data = request.data
    if User.objects.filter(username=data.get('username')).exists():
        return Response({"error": "Username already exists"}, status=400)
    if User.objects.filter(email=data.get('email')).exists():
        return Response({"error": "Email already exists"}, status=400)

    user = User.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        full_name=data.get('full_name', ''),
        phone=data.get('phone', ''),
        gender=data.get('gender', ''),
        is_provider=data.get('is_provider', False)
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "message": "User registered successfully"})


@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "message": "Login successful", "is_provider": user.is_provider})
    return Response({"error": "Invalid credentials"}, status=400)


@api_view(['POST'])
def login_provider(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user and user.is_provider:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "message": "Provider login successful", "id": user.id})
    return Response({"error": "Invalid credentials or not a provider"}, status=403)


@api_view(['POST'])
def login_admin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user and user.is_staff and user.is_superuser:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "message": "Admin login successful"})
    return Response({"error": "Invalid credentials or not admin"}, status=403)


# ---------------- USER PROFILE ---------------- #

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_profile(request):
    if request.method == 'PUT':
        serializer = UserProfileSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    serializer = UserProfileSerializer(instance=request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_users(request):
    users = CustomUser.objects.all()
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def get_logged_in_user_info(request):
    if request.method == 'PUT':
        serializer = UserProfileSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    serializer = UserProfileSerializer(instance=request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_user_by_admin(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"})
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_by_admin(request):
    if not request.user.is_staff or not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=403)
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ---------------- STORE / COUNTRY / REGION ---------------- #

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_stores(request):
    stores = Store.objects.all()
    serializer = StoreSerializer(stores, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_store(request):
    serializer = StoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_store(request, store_id):
    try:
        store = Store.objects.get(id=store_id)
        serializer = StoreSerializer(store, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Store.DoesNotExist:
        return Response({"error": "Store not found"}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_store(request, store_id):
    try:
        store = Store.objects.get(id=store_id)
        store.delete()
        return Response({"message": "Store deleted successfully"})
    except Store.DoesNotExist:
        return Response({"error": "Store not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_countries(request):
    countries = Country.objects.all()
    serializer = CountrySerializer(countries, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_country(request):
    serializer = CountrySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_country(request, country_id):
    try:
        country = Country.objects.get(id=country_id)
        country.delete()
        return Response({"message": "Country deleted successfully"})
    except Country.DoesNotExist:
        return Response({"error": "Country not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_regions(request):
    regions = Region.objects.all()
    serializer = RegionSerializer(regions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_region(request):
    serializer = RegionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_region(request, region_id):
    try:
        region = Region.objects.get(id=region_id)
        region.delete()
        return Response({"message": "Region deleted successfully"})
    except Region.DoesNotExist:
        return Response({"error": "Region not found"}, status=404)


# ---------------- PROVIDER APPLICATIONS / FLYERS ---------------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_provider_application(request):
    serializer = ProviderApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_provider_applications(request):
    applications = ProviderApplication.objects.all()
    serializer = ProviderApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_provider_application(request, application_id):
    try:
        app = ProviderApplication.objects.get(id=application_id)
        serializer = ProviderApplicationSerializer(app)
        return Response(serializer.data)
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_provider_application(request, application_id):
    try:
        app = ProviderApplication.objects.get(id=application_id)
        serializer = ProviderApplicationSerializer(app, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_provider_application(request, application_id):
    try:
        app = ProviderApplication.objects.get(id=application_id)
        app.delete()
        return Response({"message": "Application deleted successfully"})
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def provider_brochures_pages(request, provider_id):
    try:
        flyers = Flyer.objects.filter(store__provider__id=provider_id)
        serializer = FlyerSerializer(flyers, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# ---------------- PENDING FLYER UPLOAD ---------------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_pending_flyer(request, flyer_id):
    try:
        flyer = PendingFlyer.objects.get(id=flyer_id)
    except PendingFlyer.DoesNotExist:
        return Response({"error": "Pending flyer not found"}, status=404)

    serializer = FlyerSerializer(instance=flyer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# ---------------- CART SYSTEM ---------------- #

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request, cart_slug=None):
    cart = Cart.objects.get(slug=cart_slug) if cart_slug else Cart.objects.get_or_create(user=request.user)[0]
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request, cart_slug=None):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    cart = Cart.objects.get(slug=cart_slug) if cart_slug else Cart.objects.get_or_create(user=request.user)[0]
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    cart_item.quantity += quantity if not created else quantity
    if not cart_item.slug:
        cart_item.slug = slugify(f"{cart_item.product.name}-{cart_item.cart.user.username}-{int(timezone.now().timestamp())}")
    cart_item.save()

    return Response(CartSerializer(cart).data, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_slug):
    try:
        item = CartItem.objects.get(slug=item_slug, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    quantity = int(request.data.get("quantity", 1))
    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()
    return Response(CartSerializer(item.cart).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_slug):
    try:
        item = CartItem.objects.get(slug=item_slug, cart__user=request.user)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_cart(request, cart_slug=None):
    cart = Cart.objects.get(slug=cart_slug) if cart_slug else Cart.objects.get_or_create(user=request.user)[0]
    cart.items.all().delete()
    return Response(CartSerializer(cart).data)


# ---------------- SERVER STATUS ---------------- #

@api_view(['GET'])
def server_status(request):
    return Response({"status": "Server running OK"})
