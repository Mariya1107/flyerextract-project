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
    store_name = serializers.CharField(source='store.name', read_only=True)
    store_slug = serializers.CharField(source='store.slug', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'store_name', 'store_slug']


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

    class Meta:
        model = CartItem
        fields = ['id', 'slug', 'product', 'product_id', 'quantity', 'total_price']

    def get_total_price(self, obj):
        if obj.product:
            return obj.quantity * obj.product.price
        return 0


# ---------------- CART ---------------- #
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True, source='cartitem_set')
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'created_at']
        read_only_fields = ['user', 'total_price', 'created_at']

    def get_total_price(self, obj):
        return sum(
            item.quantity * item.product.price
            for item in obj.cartitem_set.all()
            if item.product is not None
        )
