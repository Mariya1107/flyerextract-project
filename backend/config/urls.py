
from django.contrib import admin

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from flyers.views import upload_cropped_product, search_products

urlpatterns = [
    path('admin/', admin.site.urls),

    # Main app (flyers) routes
    path('', include('flyers.urls')),

    # Product-related API endpoints
    path('api/products/upload/', upload_cropped_product, name='upload_cropped_product'),
    path('api/products/search/', search_products, name='search_products'),

    # Account-related endpoints
    path('api/accounts/', include('accounts.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
