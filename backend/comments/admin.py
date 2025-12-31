from django.contrib import admin
from .models import Comment, CommentVote


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "score", "is_hidden", "created_at")
    list_filter = ("is_hidden",)
    search_fields = ("content",)
    actions = ["hide_comments", "restore_comments"]

    def hide_comments(self, request, queryset):
        queryset.update(is_hidden=True)

    def restore_comments(self, request, queryset):
        queryset.update(is_hidden=False)

    hide_comments.short_description = "Hide selected comments"
    restore_comments.short_description = "Restore selected comments"


@admin.register(CommentVote)
class CommentVoteAdmin(admin.ModelAdmin):
    list_display = ("comment", "user", "value")
