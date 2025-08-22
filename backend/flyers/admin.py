from django.contrib import admin
from .models import Country, Region, Store, Flyer, Product, ProviderApplication, PendingFlyer

# --- Country ---
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "slug")
    search_fields = ("name",)
    lookup_field = "slug"  # Use slug in admin URLs

# --- Region ---
@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name", "country")}
    list_display = ("name", "country", "slug")
    list_filter = ("country",)
    search_fields = ("name", "country__name")
    lookup_field = "slug"

# --- Store ---
@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "provider", "slug")
    list_filter = ("provider",)
    search_fields = ("name", "provider__full_name")
    lookup_field = "slug"

# --- Flyer ---
@admin.register(Flyer)
class FlyerAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title", "region")}
    list_display = ("title", "store", "region", "expires_at", "slug")
    list_filter = ("store", "region")
    search_fields = ("title", "store__name", "region__name")
    lookup_field = "slug"

# --- Product ---
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name", "flyer")}
    list_display = ("name", "flyer", "price", "slug")
    list_filter = ("flyer",)
    search_fields = ("name", "flyer__title")
    lookup_field = "slug"

# --- Provider Application ---
@admin.register(ProviderApplication)
class ProviderApplicationAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("full_name", "company_name")}
    list_display = ("full_name", "email", "company_name", "submitted_at", "gst_number", "slug")
    list_filter = ("gender", "company_name", "reviewed")
    search_fields = ("full_name", "email", "phone", "company_name")
    lookup_field = "slug"

# --- Pending Flyer ---
@admin.register(PendingFlyer)
class PendingFlyerAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title", "store")}
    list_display = ("title", "store", "region", "expires_at", "slug")
    list_filter = ("store", "region")
    search_fields = ("title", "store__name", "region__name")
    lookup_field = "slug"
