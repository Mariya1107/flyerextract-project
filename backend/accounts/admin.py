from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "full_name", "phone", "gender",  "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_superuser", "gender")

   
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {
            "fields": ("full_name", "email", "phone", "gender",)
        }),
        ("Permissions", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username", "password1", "password2",
                "full_name", "email", "phone", "gender",
                "is_staff", "is_superuser"
            ),
        }),
    )


    search_fields = ("username", "email", "full_name")
    ordering = ("username",)

admin.site.register(CustomUser, CustomUserAdmin)
