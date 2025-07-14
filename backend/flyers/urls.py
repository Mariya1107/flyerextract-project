from django.urls import path
from . import views
from .views import FlyerListAll

urlpatterns = [
    path('countries/', views.CountryList.as_view()),
    path('regions/<int:country_id>/', views.RegionListByCountry.as_view()),
    path('flyers/<int:region_id>/', views.FlyerListByRegion.as_view()),
    path('products/<int:flyer_id>/', views.ProductListByFlyer.as_view()),
    path('flyers/all/', FlyerListAll.as_view()),
    
    
    # ✅ Add search endpoint here
    path('products/search/', views.search_products, name='search_products'),
]
