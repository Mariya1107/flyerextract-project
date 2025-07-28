from django.contrib import admin
from .models import Country, Region, Store, Flyer, Product
from .models import ProviderApplication, PendingFlyer






admin.site.register(Country)
admin.site.register(Region)
admin.site.register(Store)
admin.site.register(Flyer)
admin.site.register(Product)


@admin.register(ProviderApplication)
class ProviderApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'company_name', 'submitted_at','gst_number' )
    list_filter = ('gender','company_name') # using 'reviewed' instead of 'company_size'
    search_fields = ('full_name', 'email', 'phone')
    
@admin.register(PendingFlyer)
class PendingFlyerAdmin(admin.ModelAdmin):
    list_display = ('title', 'store', 'region', 'expires_at')  # ✅ Added expires_at
    list_filter = ('store', 'region')
    search_fields = ('title', 'store__name', 'region__name')