from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserProfileSerializer

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
                "message": "Provider login successful"
            })
        else:
            return Response({"error": "User is not a provider"}, status=403)
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user_info(request):
    user = request.user
    stores = user.stores.all()

    return Response({
        "username": user.username,
        "email": user.email,
        "is_provider": user.is_provider,
        "stores": [{"id": store.id, "name": store.name} for store in stores] if stores.exists() else []
    })