from django.db import models
from accounts.models import AnonymousUser
from posts.models import Post


class PostReport(models.Model):
    REASON_CHOICES = [
        ("spam", "Spam"),
        ("harassment", "Harassment"),
        ("hate", "Hate Speech"),
        ("violence", "Violence"),
        ("illegal", "Illegal Content"),
        ("other", "Other"),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reports")
    user = models.ForeignKey(AnonymousUser, on_delete=models.CASCADE)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    details = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"Report on Post {self.post.id} - {self.reason}"
