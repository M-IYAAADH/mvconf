from django.contrib import admin
from .models import Post, PostVote


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "score", "is_hidden", "created_at")
    list_filter = ("category", "is_hidden")
    search_fields = ("title", "content")
    actions = ["hide_posts", "restore_posts"]

    def hide_posts(self, request, queryset):
        queryset.update(is_hidden=True)

    def restore_posts(self, request, queryset):
        queryset.update(is_hidden=False)

    hide_posts.short_description = "Hide selected posts"
    restore_posts.short_description = "Restore selected posts"


@admin.register(PostVote)
class PostVoteAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "value")
