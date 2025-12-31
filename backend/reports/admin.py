from django.contrib import admin
from .models import PostReport


@admin.register(PostReport)
class PostReportAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "reason", "created_at")
    list_filter = ("reason", "created_at")
    search_fields = ("reason", "details")
    readonly_fields = ("post", "user", "reason", "details", "created_at")
