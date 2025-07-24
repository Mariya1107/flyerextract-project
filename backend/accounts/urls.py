from django.urls import path
from .views import (
    register_user, login_user, login_provider, login_admin,
    get_logged_in_user_info, user_profile, list_all_users,
    delete_user, update_user_by_admin, get_user_by_id, list_stores,
    create_user_by_admin, update_store, create_store, delete_store,
    list_countries, create_country, delete_country,
    list_regions, add_region, delete_region,
    create_provider_application, list_provider_applications,
    get_provider_application, update_provider_application,
    delete_provider_application,  # ✅ Added region views
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('login/provider/', login_provider, name='provider-login'),
    path('login/admin/', login_admin, name='admin-login'),
    path('me/', get_logged_in_user_info, name='get_logged_in_user_info'),
    path('profile/', user_profile, name='user-profile'),

    # Admin user management
    path('admin/users/', list_all_users),
    path('admin/users/<int:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('admin/users/<int:user_id>/update/', update_user_by_admin, name='update_user'),
    path('admin/users/<int:user_id>/delete/', delete_user, name='delete_user'),
    path('admin/users/create/', create_user_by_admin, name='create_user'),

    # Store management
    path('stores/', list_stores, name='list_stores'), 
    path('stores/<int:store_id>/update/', update_store, name='update_store'),
    path('stores/<int:store_id>/delete/', delete_store, name='delete_store'),
    path('stores/create/', create_store, name='create_store'),

    # Country management
    path('countries/', list_countries, name='list-countries'),
    path('countries/add/', create_country, name='create-country'),
    path('countries/<int:country_id>/', delete_country, name='delete-country'),

    # ✅ Region management
    path('regions/', list_regions, name='list-regions'),                     # GET all regions
    path('regions/add/', add_region, name='add-region'),                     # POST add region
    path('regions/<int:region_id>/', delete_region, name='delete-region'),   # DELETE region


    # ✅ ProviderApplication management
    path('provider/applications/create/', create_provider_application),
    path('provider/applications/', list_provider_applications),
    path('provider/applications/<int:application_id>/', get_provider_application),
    path('provider/applications/<int:application_id>/update/', update_provider_application),
    path('provider/applications/<int:application_id>/delete/', delete_provider_application),
]
