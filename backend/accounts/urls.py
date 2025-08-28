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
    delete_provider_application, provider_brochures_pages,
    server_status,
    # Cart views
    get_cart, add_to_cart, update_cart_item, remove_from_cart, clear_cart, checkout_cart, create_new_cart
)

urlpatterns = [
    # Auth / User
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('login/provider/', login_provider, name='provider-login'),
    path('login/admin/', login_admin, name='admin-login'),
    path('me/', get_logged_in_user_info, name='get_logged_in_user_info'),
    path('profile/', user_profile, name='user-profile'),
    path('server-status/', server_status),

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

    # Region management
    path('regions/', list_regions, name='list-regions'),
    path('regions/add/', add_region, name='add-region'),
    path('regions/<int:region_id>/', delete_region, name='delete-region'),

    # ProviderApplication management
    path('provider/applications/create/', create_provider_application),
    path('provider/applications/', list_provider_applications),
    path('provider/applications/<int:application_id>/', get_provider_application),
    path('provider/applications/<int:application_id>/update/', update_provider_application),
    path('provider/applications/<int:application_id>/delete/', delete_provider_application),

    # Flyers management
    path('brochures/<int:provider_id>/pages/', provider_brochures_pages),

    # ---------------- CART SYSTEM ---------------- #
    # Get cart
    path('cart/', get_cart, name='get-cart'),
    path('cart/<slug:cart_slug>/', get_cart, name='get-cart-slug'),

    # Add to cart
    path('cart/add/', add_to_cart, name='add-to-cart'),
    path('cart/<slug:cart_slug>/add/', add_to_cart, name='add-to-cart-slug'),

    # Update cart item
    path('cart/item/<slug:item_slug>/update/', update_cart_item, name='update-cart-item'),

    # Remove cart item
    path('cart/item/<slug:item_slug>/remove/', remove_from_cart, name='remove-cart-item'),

    # Clear cart
    path('cart/clear/', clear_cart, name='clear-cart'),
    path('cart/<slug:cart_slug>/clear/', clear_cart, name='clear-cart-slug'),

        # Create a brand new cart (deactivates old one)
    path('cart/new/', create_new_cart, name='create-new-cart'),

    path('cart/checkout/', checkout_cart, name='checkout-cart'),
    path('cart/<slug:cart_slug>/checkout/', checkout_cart, name='checkout-cart-slug'),
]
