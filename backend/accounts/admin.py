from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Cart, CartItem


# ------------------ Custom User Admin ------------------ #
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = (
        "username", "email", "full_name", "phone", "gender",
        "profile_photo", "is_provider", "is_staff", "is_superuser"
    )
    list_filter = ("is_staff", "is_superuser", "gender", "is_provider")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {
            "fields": (
                "full_name", "email", "phone", "gender",
                "is_provider", "stores", "profile_photo"
            )
        }),
        ("Permissions", {
            "fields": (
                "is_active", "is_staff", "is_superuser",
                "groups", "user_permissions"
            )
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username", "password1", "password2",
                "full_name", "email", "phone", "gender",
                "is_provider", "stores", "profile_photo",
                "is_staff", "is_superuser"
            ),
        }),
    )

    search_fields = ("username", "email", "full_name")
    ordering = ("username",)


# ------------------ Cart Admin ------------------ #
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ("slug", "total_price")
    autocomplete_fields = ("product",)


class CartAdmin(admin.ModelAdmin):
    model = Cart
    list_display = ("user", "created_at", "slug", "total_cart_price")
    inlines = [CartItemInline]
    search_fields = ("user__username", "user__email")
    readonly_fields = ("slug",)

    def total_cart_price(self, obj):
        return obj.total_price
    total_cart_price.short_description = "Total Price"


# ------------------ CartItem Admin ------------------ #
class CartItemAdmin(admin.ModelAdmin):
    model = CartItem
    list_display = ("cart", "product", "quantity", "total_price", "slug")
    search_fields = ("cart__user__username", "product__name")
    readonly_fields = ("slug", "total_price")


# ------------------ Register Admins ------------------ #
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
