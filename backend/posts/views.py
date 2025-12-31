import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from posts.ranking import calculate_hot_score
from accounts.rate_limit import is_rate_limited
from .models import Post, PostVote


@csrf_exempt
def create_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = getattr(request, "anon_user", None)
    if not user or user.is_banned:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    # ✅ RATE LIMIT (3 posts / 5 minutes)
    rate_key = f"post:{user.id}"
    if is_rate_limited(rate_key, limit=3, window=300):
        return JsonResponse(
            {"error": "Too many posts. Slow down."},
            status=429
        )

    data = json.loads(request.body or "{}")

    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    category = data.get("category")

    if not title or not content:
        return JsonResponse({"error": "Title and content required"}, status=400)

    if len(content) > 2000:
        return JsonResponse({"error": "Content too long"}, status=400)

    post = Post.objects.create(
        author=user,
        title=title,
        content=content,
        category=category,
    )

    return JsonResponse(
        {"id": post.id, "message": "Confession posted"},
        status=201
    )


def list_posts(request):
    posts = Post.objects.filter(is_hidden=False).order_by("-created_at")[:50]

    return JsonResponse({
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "category": p.category,
                "score": p.score,
                "created_at": p.created_at.isoformat(),
            }
            for p in posts
        ]
    })


@csrf_exempt
def vote_post(request, post_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = getattr(request, "anon_user", None)
    if not user or user.is_banned:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    # ✅ RATE LIMIT (10 votes / minute)
    rate_key = f"vote:{user.id}"
    if is_rate_limited(rate_key, limit=10, window=60):
        return JsonResponse(
            {"error": "Too many votes. Slow down."},
            status=429
        )

    data = json.loads(request.body or "{}")
    value = data.get("value")

    if value not in (1, -1):
        return JsonResponse({"error": "Invalid vote"}, status=400)

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    # Create or update vote
    PostVote.objects.update_or_create(
        user=user,
        post=post,
        defaults={"value": value},
    )

    # Recalculate score
    post.score = (
        PostVote.objects
        .filter(post=post)
        .aggregate(total=Sum("value"))["total"]
        or 0
    )

    # 🔥 Recalculate HOT score
    post.hot_score = calculate_hot_score(post.score, post.created_at)
    post.save()

    return JsonResponse({
        "post_id": post.id,
        "new_score": post.score,
        "hot_score": round(post.hot_score, 5),
    })


def search_posts(request):
    """
    Query params:
    - q: search text
    - category: filter by category
    - sort: hot | new | top
    - time: 24h | 7d | all
    """

    qs = Post.objects.filter(is_hidden=False)

    # 🔍 Text search
    query = request.GET.get("q")
    if query:
        qs = qs.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query)
        )

    # 🏷️ Category filter
    category = request.GET.get("category")
    if category:
        qs = qs.filter(category=category)

    # 🕒 Time filter
    time_filter = request.GET.get("time")
    if time_filter == "24h":
        qs = qs.filter(created_at__gte=timezone.now() - timedelta(hours=24))
    elif time_filter == "7d":
        qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=7))

    # 🔥 Sorting
    sort = request.GET.get("sort", "hot")
    if sort == "new":
        qs = qs.order_by("-created_at")
    elif sort == "top":
        qs = qs.order_by("-score")
    else:  # hot (default)
        qs = qs.order_by("-hot_score")

    qs = qs[:50]  # limit for MVP

    return JsonResponse({
        "results": [
            {
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "category": p.category,
                "score": p.score,
                "hot_score": round(p.hot_score, 5),
                "created_at": p.created_at.isoformat(),
            }
            for p in qs
        ]
    })

