from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from flyers.models import Store
from flyers.serializers import StoreSerializer
from .serializers import RegisterSerializer
from .models import CustomUser
from flyers.models import Country, Region
from flyers.serializers import CountrySerializer
from flyers.serializers import RegionSerializer
from flyers.models import ProviderApplication
from flyers.serializers import ProviderApplicationSerializer
from flyers.models import Flyer
from flyers.serializers import FlyerSerializer

User = get_user_model()

@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=data['email']).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            gender=data.get('gender', ''),
            is_provider=data.get('is_provider', False)  # ✅ You can set provider during registration
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "message": "User registered successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "message": "Login successful",
            "is_provider": user.is_provider
        })
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def login_provider(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        if user.is_provider:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "message": "Provider login successful",
                 "id": user.id
            })
        else:
            return Response({"error": "User is not a provider"}, status=403)
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  # ✅ Support for profile_photo file uploads
def user_profile(request):
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
def login_admin(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        # Check if user is provider, staff, and superuser
        if user.is_provider and user.is_staff and user.is_superuser:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "message": "Admin login successful"
            })
        else:
            return Response({"error": "User does not have admin privileges"}, status=403)

    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['GET', 'PUT'])  # <-- Add PUT here
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  # <-- Support file uploads
def get_logged_in_user_info(request):
    user = request.user

    if request.method == 'GET':
        stores = user.stores.all()
        return Response({
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "gender": user.gender,
            "profile_photo": request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None,
            "stores": [{"id": store.id, "name": store.name} for store in stores] if stores.exists() else []
        })

    if request.method == 'PUT':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_users(request):
    users = CustomUser.objects.all()
    data = []
    for user in users:
        data.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "gender": user.gender,
            "date_joined": user.date_joined.strftime("%d %b %Y"),
            "is_active": user.is_active,
            "profile_photo": request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None,
            "username": user.username,
            "is_provider": user.is_provider,
        })
    return Response(data)

# views.py
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=200)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_user_by_admin(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_stores(request):
    stores = Store.objects.all()
    serializer = StoreSerializer(stores, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_store(request, store_id):
    try:
        store = Store.objects.get(id=store_id)
    except Store.DoesNotExist:
        return Response({'error': 'Store not found'}, status=404)

    serializer = StoreSerializer(store, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_store(request):
    serializer = StoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_by_admin(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'success': True, 'user_id': user.id}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_store(request, store_id):
    try:
        store = Store.objects.get(id=store_id)
    except Store.DoesNotExist:
        return Response({'error': 'Store not found'}, status=404)

    store.delete()
    return Response({'message': 'Store deleted successfully'}, status=200)

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
    except Country.DoesNotExist:
        return Response({'error': 'Country not found'}, status=404)

    country.delete()
    return Response({'message': 'Country deleted successfully'}, status=200)

@api_view(['GET'])
def list_regions(request):
    regions = Region.objects.select_related('country').all()
    serializer = RegionSerializer(regions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_region(request):
    serializer = RegionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_region(request, region_id):
    try:
        region = Region.objects.get(id=region_id)
        region.delete()
        return Response({'message': 'Region deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Region.DoesNotExist:
        return Response({'error': 'Region not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
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
    applications = ProviderApplication.objects.all().order_by('-submitted_at')
    serializer = ProviderApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_provider_application(request, application_id):
    try:
        application = ProviderApplication.objects.get(id=application_id)
        serializer = ProviderApplicationSerializer(application)
        return Response(serializer.data)
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_provider_application(request, application_id):
    try:
        application = ProviderApplication.objects.get(id=application_id)
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)

    serializer = ProviderApplicationSerializer(application, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_provider_application(request, application_id):
    try:
        application = ProviderApplication.objects.get(id=application_id)
        application.delete()
        return Response({"message": "Application deleted"}, status=204)
    except ProviderApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def provider_brochures_pages(request, provider_id):
    if request.user.id != provider_id:
        return Response({"error": "Unauthorized access"}, status=403)

    flyers = Flyer.objects.filter(store__provider__id=provider_id)
    serializer = FlyerSerializer(flyers, many=True, context={'request': request})
    return Response(serializer.data)