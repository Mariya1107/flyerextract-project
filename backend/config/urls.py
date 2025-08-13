
from django.contrib import admin

from django.urls import path, include,re_path
from django.conf import settings
from django.conf.urls.static import static
from flyers.views import upload_cropped_product, search_products
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="API documentation for my project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
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
