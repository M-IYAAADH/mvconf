import uuid
from django.db import models

class AnonymousUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pseudonym = models.CharField(max_length=50, unique=True)
    ip_hash = models.CharField(max_length=64)
    is_banned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pseudonym
