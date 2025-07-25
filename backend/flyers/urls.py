from django.urls import path
from . import views
from .views import become_provider
from .views import FlyerListAll
from .views import submit_provider_application
from .views import StoreListView, FlyersByStoreView
from .views import flyers_by_store_id
from .views import RegionList
from .views import flyers_by_provider 


urlpatterns = [
    path('countries/', views.CountryList.as_view()),
    path('regions/<int:country_id>/', views.RegionListByCountry.as_view()),
    path('flyers/<int:region_id>/', views.FlyerListByRegion.as_view()),
    path('products/<int:flyer_id>/', views.ProductListByFlyer.as_view()),
    path('flyers/all/', FlyerListAll.as_view()),
    path('api/provider-apply/', submit_provider_application, name='provider-apply'),
    path('regions/', RegionList.as_view(), name='region-list'),
    path('api/become-provider/', views.become_provider, name='become_provider'),
    path('stores/', StoreListView.as_view()),
    path('flyers/store/<str:store_name>/', FlyersByStoreView.as_view(), name='flyers-by-store'),
    path("flyers/<int:store_id>/", flyers_by_store_id),  # ✅ new route
    path('flyers/upload/', views.upload_flyer, name='upload-flyer'),
    path('provider/<int:provider_id>/flyers/', flyers_by_provider, name='flyers-by-provider'),
    

   

    
    
    # ✅ Add search endpoint here
    path('products/search/', views.search_products, name='search_products'),
]


