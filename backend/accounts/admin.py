from django.contrib import admin
from .models import AnonymousUser


@admin.register(AnonymousUser)
class AnonymousUserAdmin(admin.ModelAdmin):
    list_display = ("pseudonym", "is_banned", "created_at")
    list_filter = ("is_banned",)
    search_fields = ("pseudonym",)
    actions = ["ban_users", "unban_users"]

    def ban_users(self, request, queryset):
        queryset.update(is_banned=True)

    def unban_users(self, request, queryset):
        queryset.update(is_banned=False)

    ban_users.short_description = "Ban selected users"
    unban_users.short_description = "Unban selected users"
