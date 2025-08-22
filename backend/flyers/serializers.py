from .models import Country, Region, Store, Flyer, Product, ProviderApplication, PendingFlyer
from rest_framework import serializers

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
        queryset=Region.objects.all(), write_only=True, source='region'
    )
    region_slug = serializers.SlugField(source="region.slug", read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'logo', 'region', 'region_id', 'region_slug']


# -------------------- FLYER --------------------
class FlyerSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    store = StoreSerializer(read_only=True)
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


class FlyerMinimalSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    pdf = serializers.FileField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Flyer
        fields = ['id', 'slug', 'title', 'image', 'pdf']


# -------------------- PRODUCT --------------------
class ProductSerializer(serializers.ModelSerializer):
    flyer = FlyerMinimalSerializer(read_only=True)
    store_slug = serializers.SerializerMethodField()
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'flyer', 'store_slug']

    def get_store_slug(self, obj):
        return obj.flyer.store.slug if obj.flyer and obj.flyer.store else None


# -------------------- PROVIDER --------------------
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

    store = StoreSerializer(read_only=True)
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
        provider = obj.provider_stores.first()  # get first provider linked to this store
        return provider.phone if provider else None
