from .models import Country, Region, Store, Flyer, Product, ProviderApplication, PendingFlyer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

# -------------------- COUNTRY --------------------
class CountrySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Country
        fields = ['id', 'name', 'slug']


# -------------------- REGION --------------------
class RegionSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    country = CountrySerializer(read_only=True)
    country_slug = serializers.SlugField(source="country.slug", read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), write_only=True, source='country'
    )

    class Meta:
        model = Region
        fields = ['id', 'name', 'slug', 'country', 'country_slug', 'country_id']


# -------------------- STORE --------------------
class StoreSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        write_only=True,
        source='region'
    )
    region_slug = serializers.SlugField(source="region.slug", read_only=True)

    provider_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_provider=True),
        write_only=True,
        source="provider",
        required=False
    )
    provider = serializers.StringRelatedField(read_only=True)  # show provider name/email

    class Meta:
        model = Store
        fields = [
            'id',
            'name',
            'slug',
            'logo',
            'region',
            'region_id',
            'region_slug',
            'provider',
            'provider_id',
        ]



# -------------------- STORE (BASIC for user profile or flyers) --------------------
class StoreBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'slug']


# -------------------- USER / PROVIDER --------------------
class UserProfileSerializer(serializers.ModelSerializer):
    # ✅ Nested stores with id + name + slug instead of just IDs
    stores = StoreBasicSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'phone',
            'profile_photo',
            'stores',
        ]


# -------------------- FLYER --------------------
class FlyerSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    store = StoreBasicSerializer(read_only=True)  # ✅ always nested with name
    store_id = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.all(), write_only=True, source='store'
    )
    store_slug = serializers.SlugField(source="store.slug", read_only=True)

    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), write_only=True, source='region'
    )
    region_slug = serializers.SlugField(source="region.slug", read_only=True)

    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    pdf = serializers.FileField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Flyer
        fields = [
            'id',
            'slug',
            'title',
            'pdf',
            'image',
            'store',
            'store_id',
            'store_slug',
            'region',
            'region_id',
            'region_slug',
            'expires_at'
        ]


# -------------------- FLYER (MINIMAL, for products etc.) --------------------
class FlyerMinimalSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    store = StoreBasicSerializer(read_only=True)  # ✅ includes store name
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    pdf = serializers.FileField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Flyer
        fields = ['id', 'slug', 'title', 'image', 'pdf', 'store']


# -------------------- PRODUCT --------------------
from rest_framework import serializers
from .models import Product, Flyer

class FlyerMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flyer
        fields = ['id', 'title', 'slug']  # minimal fields for nested display

class ProductSerializer(serializers.ModelSerializer):
    flyer = FlyerMinimalSerializer(read_only=True)
    store_name = serializers.SerializerMethodField()
    store_slug = serializers.SerializerMethodField()
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'flyer', 'store_name', 'store_slug']

    def get_store_name(self, obj):
        # Check flyer and store existence
        return obj.flyer.store.name if obj.flyer and obj.flyer.store else "Unknown Store"

    def get_store_slug(self, obj):
        return obj.flyer.store.slug if obj.flyer and obj.flyer.store else "unknown-store"



# -------------------- PROVIDER APPLICATION --------------------
class ProviderApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = '__all__'


# -------------------- STORE WITH FLYERS --------------------
class StoreWithFlyersSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    flyers = FlyerSerializer(source='flyer_set', many=True, read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'slug', 'name', 'logo', 'flyers']


# -------------------- PENDING FLYER --------------------
class PendingFlyerSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    store = StoreBasicSerializer(read_only=True)  # ✅ always include store name
    store_id = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.all(), write_only=True, source='store'
    )
    store_slug = serializers.SlugField(source="store.slug", read_only=True)

    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), write_only=True, source='region'
    )
    region_slug = serializers.SlugField(source="region.slug", read_only=True)

    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    pdf = serializers.FileField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = PendingFlyer
        fields = [
            'id',
            'slug',
            'title',
            'pdf',
            'image',
            'store',
            'store_id',
            'store_slug',
            'region',
            'region_id',
            'region_slug',
            'expires_at',
        ]

    def validate(self, data):
        if not data.get('pdf') and not data.get('image'):
            raise serializers.ValidationError("You must provide at least a PDF or an image.")
        return data


# -------------------- STORE WITH PHONE --------------------
class StoreWithPhoneSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    phone = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ["id", "slug", "name", "phone"]

    def get_phone(self, obj):
        provider = obj.provider_stores.first()
        return provider.phone if provider else None
