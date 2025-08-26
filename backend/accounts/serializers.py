from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Cart, CartItem
from flyers.models import Product


# ---------------- REGISTER ---------------- #
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'username', 'email', 'phone', 'gender', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


# ---------------- LOGIN ---------------- #
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")


# ---------------- USER PROFILE ---------------- #
class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'full_name', 'phone', 'gender',
            'profile_photo', 'stores', 'last_login'
        ]


# ---------------- PRODUCT ---------------- #
class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.SerializerMethodField()
    store_slug = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()  # <-- use this

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'store_name', 'store_slug']

    def get_store_name(self, obj):
        return obj.flyer.store.name if obj.flyer and obj.flyer.store else "Unknown"

    def get_store_slug(self, obj):
        return obj.flyer.store.slug if obj.flyer and obj.flyer.store else "unknown"

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

# ---------------- CART ITEM ---------------- #
class CartItemSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    total_price = serializers.SerializerMethodField()
    store_name = serializers.SerializerMethodField()
    store_slug = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'slug', 'product', 'product_id',
            'quantity', 'total_price', 'store_name', 'store_slug'
        ]

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price if obj.product else 0

    def get_store_name(self, obj):
        if obj.product and obj.product.flyer and obj.product.flyer.store:
            return obj.product.flyer.store.name
        return "Unknown"

    def get_store_slug(self, obj):
        if obj.product and obj.product.flyer and obj.product.flyer.store:
            return obj.product.flyer.store.slug
        return "unknown"


# ---------------- CART ---------------- #

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # won't auto-fetch existing cart

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'created_at']
        read_only_fields = ['total_price', 'created_at', 'user']

    def get_total_price(self, obj):
        return sum(item.quantity * (item.product.price if item.product else 0) for item in obj.items.all())

    # Ensure a new cart is created even if the user already has one
    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None
        return Cart.objects.create(user=user)

