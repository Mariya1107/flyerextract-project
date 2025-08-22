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
    FlyerDetail,  # ✅ Import new view
)

urlpatterns = [
    # Country & Region
    path("countries/", views.CountryList.as_view(), name="country-list"),
    path("regions/", RegionList.as_view(), name="region-list"),
    path("regions/<slug:country_slug>/", views.RegionListByCountry.as_view(), name="regions-by-country"),

    # Store & Flyers
    path("stores/", StoreListView.as_view(), name="store-list"),
    path("flyers/<slug:region_slug>/", views.FlyerListByRegion.as_view(), name="flyers-by-region"),
    path("flyers/store/<slug:store_slug>/", FlyersByStoreView.as_view(), name="flyers-by-store"),
    path("flyers/all/", FlyerListAll.as_view(), name="flyers-all"),
    path("stores/search/", StoreSearchAPIView.as_view(), name="store-search"),

    # Flyer Upload and Admin Approval Flow
    path("flyers/upload/", views.upload_flyer, name="upload-flyer"),
    path("flyers/upload_pending/", upload_pending_flyer, name="upload-pending-flyer"),
    path("admin/pending-flyers/", PendingFlyerListView.as_view(), name="pending-flyers"),
    path("admin/approve-flyer/<slug:flyer_slug>/", approve_pending_flyer, name="approve-flyer"),
    path("api/reject-flyer/<slug:flyer_slug>/", reject_pending_flyer, name="reject-flyer"),
    path("flyers/pending/", PendingFlyerListView.as_view(), name="pending-flyers-list"),

    # Provider Related
    path("api/provider-apply/", submit_provider_application, name="provider-apply"),
    path("api/become-provider/", become_provider, name="become-provider"),
    path("provider/<slug:provider_slug>/flyers/", flyers_by_provider, name="flyers-by-provider"),

    # Admin Dashboard Counts
    path("api/dashboard-counts/", dashboard_counts, name="dashboard_counts"),
    path("api/provider-dashboard-counts/", provider_dashboard_counts, name="provider-dashboard-counts"),

    # Products (by flyer slug)
    path("products/<slug:flyer_slug>/", views.ProductListByFlyer.as_view(), name="products-by-flyer"),
    path("products/search/", views.search_products, name="search-products"),

    # Create/Delete/Edit Flyer
    path("api/flyers/create/", create_flyer, name="flyer-create"),
    path("api/flyers/<slug:flyer_slug>/delete/", delete_flyer, name="flyer-delete"),
    path("flyers/<slug:flyer_slug>/edit/", update_flyer, name="update-flyer"),

    # Store by Name
    path("stores/by-name/<slug:slug>/", store_by_name, name="store-by-name"),

    # ✅ Flyer Detail by Slug
    path("flyers/slug/<slug:flyer_slug>/", FlyerDetail.as_view(), name="flyer-detail"),
]
