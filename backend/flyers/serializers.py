from .models import Country, Region, Store, Flyer, Product, ProviderApplication, PendingFlyer
from rest_framework import serializers


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class RegionSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), write_only=True, source='country'
    )

    class Meta:
        model = Region
        fields = ['id', 'name', 'country', 'country_id']


# ✅ Updated StoreSerializer with region_id
class StoreSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), write_only=True, source='region'
    )
    region_id_value = serializers.IntegerField(source='region.id', read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'name', 'logo', 'region', 'region_id', 'region_id_value']


class FlyerSerializer(serializers.ModelSerializer):
    store_id = serializers.PrimaryKeyRelatedField(queryset=Store.objects.all(), write_only=True, source='store')
    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), write_only=True, source='region')

    store = StoreSerializer(read_only=True)
    region = RegionSerializer(read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Flyer
        fields = [
            'id',
            'title',
            'pdf',
            'image',
            'store',
            'region',
            'store_id',
            'region_id',
            'expires_at'
        ]


class FlyerMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flyer
        fields = ['id', 'title']


class ProductSerializer(serializers.ModelSerializer):
    flyer = FlyerMinimalSerializer(read_only=True)
    store_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'flyer', 'store_name']

    def get_store_name(self, obj):
        return obj.flyer.store.name if obj.flyer and obj.flyer.store else "Unknown"


class ProviderApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = '__all__'


class StoreWithFlyersSerializer(serializers.ModelSerializer):
    flyers = FlyerSerializer(source='flyer_set', many=True, read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'name', 'logo', 'flyers']

class PendingFlyerSerializer(serializers.ModelSerializer):
    store_id = serializers.PrimaryKeyRelatedField(queryset=Store.objects.all(), write_only=True, source='store')
    store_id_value = serializers.IntegerField(source='store.id', read_only=True)

    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), write_only=True, source='region')
    region_id_value = serializers.IntegerField(source='region.id', read_only=True)

    store = StoreSerializer(read_only=True)
    region = RegionSerializer(read_only=True)
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    pdf = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = PendingFlyer
        fields = [
            'id',
            'title',
            'pdf',
            'image',
            'store',
            'region',
            'store_id',
            'store_id_value',
            'region_id',
            'region_id_value',
            'expires_at'
        ]
        extra_kwargs = {
            'pdf': {'required': False, 'allow_null': True},
            'image': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        if not data.get('pdf') and not data.get('image'):
            raise serializers.ValidationError("You must provide at least a PDF or an image.")
        return data

