from django.db import models
from accounts.models import AnonymousUser

class Post(models.Model):
    CATEGORY_CHOICES = [
        ("island", "Island Life"),
        ("relationship", "Relationships"),
        ("work", "Work"),
        ("society", "Society"),
        ("dark", "Dark Confessions"),
        ("funny", "Funny"),
    ]

    author = models.ForeignKey(AnonymousUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    content = models.TextField(max_length=2000)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    score = models.IntegerField(default=0)
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    hot_score = models.FloatField(default=0)

    def __str__(self):
        return self.title

class PostVote(models.Model):
    UPVOTE = 1
    DOWNVOTE = -1

    VOTE_CHOICES = [
        (UPVOTE, "Upvote"),
        (DOWNVOTE, "Downvote"),
    ]

    user = models.ForeignKey(AnonymousUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    value = models.IntegerField(choices=VOTE_CHOICES)

    class Meta:
        unique_together = ('user', 'post')
