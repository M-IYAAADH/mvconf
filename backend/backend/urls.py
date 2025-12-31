from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.http import JsonResponse
from accounts.views import whoami
from posts.views import create_post, list_posts, vote_post, search_posts
from comments.views import create_comment, list_comments, vote_comment


# Legal pages (JSON responses)
def terms_view(request):
    return JsonResponse({
        "title": "Terms of Service",
        "content": "By using this platform, you agree to post responsibly. Content that violates laws or community guidelines may be removed. We reserve the right to ban abusive users.",
        "last_updated": "2024-01-01"
    })

def privacy_view(request):
    return JsonResponse({
        "title": "Privacy Policy",
        "content": "We do not collect emails, real names, or raw IPs. Your identity is hashed for anonymity. We may cooperate with law enforcement if legally required.",
        "last_updated": "2024-01-01"
    })

def content_policy_view(request):
    return JsonResponse({
        "title": "Content Policy",
        "content": "Prohibited: illegal content, harassment, doxxing, spam, impersonation. Violations result in content removal and potential bans.",
        "last_updated": "2024-01-01"
    })


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('whoami/', whoami),
    path('posts/', list_posts),
    path('posts/search/', search_posts),
    path('posts/create/', create_post),
    path('posts/<int:post_id>/vote/', vote_post),
    path('posts/<int:post_id>/comments/', list_comments),
    path('posts/<int:post_id>/comments/create/', create_comment),
    path('comments/<int:comment_id>/vote/', vote_comment),
    # Legal pages
    path('terms/', terms_view),
    path('privacy/', privacy_view),
    path('content-policy/', content_policy_view),
]
