from django.urls import path
from . import views
from .views import (
    become_provider,
    FlyerListAll,
    submit_provider_application,
    StoreListView,
    FlyersByStoreView,
    PendingFlyerListView,
    flyers_by_store_id,
    notify_admin_upload,
    RegionList,
    flyers_by_provider,
    stores_with_flyers,
    create_flyer,
    delete_flyer,
    upload_pending_flyer,
    approve_pending_flyer,
    reject_pending_flyer,
    StoreSearchAPIView,
    update_flyer,
    dashboard_counts
)

urlpatterns = [
    # Country & Region
    path('countries/', views.CountryList.as_view(), name='country-list'),
    path('regions/', RegionList.as_view(), name='region-list'),
    path('regions/<int:country_id>/', views.RegionListByCountry.as_view(), name='regions-by-country'),

    # Store & Flyers
    path('stores/', StoreListView.as_view(), name='store-list'),
    path('flyers/<int:region_id>/', views.FlyerListByRegion.as_view(), name='flyers-by-region'),
    path('flyers/store/<str:store_name>/', FlyersByStoreView.as_view(), name='flyers-by-store'),
    path('flyers/<int:store_id>/', flyers_by_store_id, name='flyers-by-store-id'),
    path('flyers/all/', FlyerListAll.as_view(), name='flyers-all'),
    path('stores/search/', StoreSearchAPIView.as_view(), name='store-search'),
    

    # Flyer Upload and Admin Approval Flow
    path('flyers/upload/', views.upload_flyer, name='upload-flyer'),
    path('flyers/upload_pending/', upload_pending_flyer, name='upload-pending-flyer'),
    path('admin/pending-flyers/', PendingFlyerListView.as_view(), name='pending-flyers'),
    path('admin/approve-flyer/<int:flyer_id>/', approve_pending_flyer, name='approve-flyer'),
    path('api/reject-flyer/<int:flyer_id>/', reject_pending_flyer, name='reject-flyer'),
    path('flyers/pending/', PendingFlyerListView.as_view(), name='pending-flyers-list'),

    # Provider Related
    path('api/provider-apply/', submit_provider_application, name='provider-apply'),
    path('api/become-provider/', become_provider, name='become-provider'),
    path('provider/<int:provider_id>/flyers/', flyers_by_provider, name='flyers-by-provider'),

    # Admin Notifications
    path('api/admin/notify-upload/', notify_admin_upload, name='notify-admin-upload'),
    path('api/dashboard-counts/', dashboard_counts, name='dashboard_counts'),
    

    # Products
    path('products/<int:flyer_id>/', views.ProductListByFlyer.as_view(), name='products-by-flyer'),
    path('products/search/', views.search_products, name='search-products'),

    # Store with Flyers
    path('api/stores-with-flyers/', stores_with_flyers, name='stores-with-flyers'),

    # Create/Delete/Edit Flyer
    path('api/flyers/create/', create_flyer, name='flyer-create'),
    path('api/flyers/<int:flyer_id>/delete/', delete_flyer, name='flyer-delete'),
    path('flyers/<int:flyer_id>/edit/', update_flyer, name='update-flyer'),
]
