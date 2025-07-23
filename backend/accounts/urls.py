from django.urls import path
from .views import (
    register_user, login_user, login_provider, login_admin,
    get_logged_in_user_info, user_profile, list_all_users,
    delete_user, update_user_by_admin, get_user_by_id, list_stores,  create_user_by_admin
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('login/provider/', login_provider, name='provider-login'),
    path('login/admin/', login_admin, name='admin-login'),
    path('me/', get_logged_in_user_info, name='get_logged_in_user_info'),
    path('profile/', user_profile, name='user-profile'),

    path('admin/users/', list_all_users),
    path('admin/users/<int:user_id>/', get_user_by_id, name='get_user_by_id'),           # GET
    path('admin/users/<int:user_id>/update/', update_user_by_admin, name='update_user'), # PUT
    path('admin/users/<int:user_id>/delete/', delete_user, name='delete_user'),          # DELETE
    path('stores/', list_stores, name='list_stores'), 
    path('admin/users/create/', create_user_by_admin, name='create_user'),
    
    
]
