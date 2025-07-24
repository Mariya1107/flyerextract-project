
from .models import Country, Region, Store, Flyer, Product
from rest_framework import serializers
from .models import ProviderApplication
from rest_framework import generics
from .models import ProviderApplication
from .models import Store





class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class RegionSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = Region
        fields = ['id', 'name', 'country']



class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'logo']


class FlyerSerializer(serializers.ModelSerializer):
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
            'expires_at'
            
            # Removed: 'start_date', 'end_date', 'created_at'
        ]


class FlyerMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flyer
        fields = ['id', 'title']


class ProductSerializer(serializers.ModelSerializer):
    flyer = FlyerMinimalSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'image',
            'flyer'
            # Removed: 'advantages', 'how_to_use', 'in_stock', 'created_at'
        ]


class ProviderApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'logo']



