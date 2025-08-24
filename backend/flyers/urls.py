from django.urls import path
from . import views
from .views import (
    become_provider,
    FlyerListAll,
    submit_provider_application,
    StoreListView,
    FlyersByStoreView,
    PendingFlyerListView,
    RegionList,
    flyers_by_provider,
    create_flyer,
    delete_flyer,
    upload_pending_flyer,
    approve_pending_flyer,
    reject_pending_flyer,
    StoreSearchAPIView,
    update_flyer,
    dashboard_counts,
    provider_dashboard_counts,
    store_by_name,
    FlyerDetail,
)

urlpatterns = [
    # 🌍 Country & Region
    path("countries/", views.CountryList.as_view(), name="country-list"),
    path("regions/", RegionList.as_view(), name="region-list"),
    path("regions/<slug:country_slug>/", views.RegionListByCountry.as_view(), name="regions-by-country"),

    # --------------------------- PROVIDER STORE ---------------------------
path("provider/store/", views.provider_store, name="provider-store"),

    # 🏬 Stores
    path("stores/", StoreListView.as_view(), name="store-list"),
    path("stores/search/", StoreSearchAPIView.as_view(), name="store-search"),
    path("stores/by-name/<slug:slug>/", store_by_name, name="store-by-name"),
    path("stores/create/", views.create_store, name="create_store"),

    # 📄 Flyers (safe ordering: specific routes FIRST, generic slug LAST)
    path("flyers/all/", FlyerListAll.as_view(), name="flyers-all"),
    path("flyers/store/<slug:store_slug>/", FlyersByStoreView.as_view(), name="flyers-by-store"),
    path("flyers/upload/", views.upload_flyer, name="upload-flyer"),
    path("flyers/upload_pending/", upload_pending_flyer, name="upload-pending-flyer"),
    path("flyers/pending/", PendingFlyerListView.as_view(), name="pending-flyers-list"),
    path("flyers/slug/<slug:flyer_slug>/", FlyerDetail.as_view(), name="flyer-detail"),
    
    path("flyers/<int:flyer_id>/edit/", update_flyer, name="update-flyer"),


    # ⚠️ Catch-all slug (must come LAST!)
    path("flyers/<slug:region_slug>/", views.FlyerListByRegion.as_view(), name="flyers-by-region"),

    # 🛠 Flyer CRUD (admin)
    path("api/flyers/create/", create_flyer, name="flyer-create"),
    path("api/flyers/<slug:flyer_slug>/delete/", delete_flyer, name="flyer-delete"),

    # ✅ Pending Flyer Admin Flow
    path("admin/pending-flyers/", PendingFlyerListView.as_view(), name="pending-flyers"),
    path("admin/approve-flyer/<slug:flyer_slug>/", approve_pending_flyer, name="approve-flyer"),
    path("api/reject-flyer/<slug:flyer_slug>/", reject_pending_flyer, name="reject-flyer"),

    # 👤 Provider
    path("api/provider-apply/", submit_provider_application, name="provider-apply"),
    path("api/become-provider/", become_provider, name="become-provider"),
    path("provider/<slug:provider_slug>/flyers/", flyers_by_provider, name="flyers-by-provider"),

    # 📊 Dashboard Counts
    path("api/dashboard-counts/", dashboard_counts, name="dashboard_counts"),
    path("api/provider-dashboard-counts/", provider_dashboard_counts, name="provider-dashboard-counts"),

    # 🛒 Products
    path("products/<slug:flyer_slug>/", views.ProductListByFlyer.as_view(), name="products-by-flyer"),
    path("products/search/", views.search_products, name="search-products"),
]
