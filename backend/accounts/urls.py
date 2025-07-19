from django.urls import path
from .views import register_user, login_user, login_provider, login_admin
from .views import get_logged_in_user_info
urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('login/provider/', login_provider, name='provider-login'),
    path('login/admin/', login_admin, name='admin-login'),
    path('me/', get_logged_in_user_info, name='get_logged_in_user_info'),
   
]
