import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum

from accounts.rate_limit import is_rate_limited
from posts.models import Post
from .models import Comment, CommentVote
from .ranking import calculate_comment_hot_score


@csrf_exempt
def create_comment(request, post_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = getattr(request, "anon_user", None)
    if not user or user.is_banned:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    # Rate limit: 5 comments / 2 minutes
    rate_key = f"comment:{user.id}"
    if is_rate_limited(rate_key, limit=5, window=120):
        return JsonResponse(
            {"error": "Too many comments. Slow down."},
            status=429
        )

    try:
        post = Post.objects.get(id=post_id, is_hidden=False)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    data = json.loads(request.body or "{}")
    content = data.get("content", "").strip()
    parent_id = data.get("parent_id")

    if not content:
        return JsonResponse({"error": "Content required"}, status=400)

    if len(content) > 1000:
        return JsonResponse({"error": "Comment too long"}, status=400)

    parent = None
    if parent_id:
        try:
            parent = Comment.objects.get(id=parent_id, post=post)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Parent comment not found"}, status=404)

    comment = Comment.objects.create(
        author=user,
        post=post,
        parent=parent,
        content=content,
    )

    return JsonResponse(
        {"id": comment.id, "message": "Comment added"},
        status=201
    )


def list_comments(request, post_id):
    try:
        post = Post.objects.get(id=post_id, is_hidden=False)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    comments = (
        Comment.objects
        .filter(post=post, parent__isnull=True, is_hidden=False)
        .order_by("-hot_score", "created_at")
    )

    def serialize(comment):
        return {
            "id": comment.id,
            "content": comment.content,
            "score": comment.score,
            "created_at": comment.created_at.isoformat(),
            "replies": [
                serialize(reply)
                for reply in comment.replies.filter(is_hidden=False).order_by("created_at")
            ]
        }

    return JsonResponse({
        "post_id": post.id,
        "comments": [serialize(c) for c in comments]
    })


@csrf_exempt
def vote_comment(request, comment_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = getattr(request, "anon_user", None)
    if not user or user.is_banned:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    # Rate limit: 15 comment votes / minute
    rate_key = f"comment-vote:{user.id}"
    if is_rate_limited(rate_key, limit=15, window=60):
        return JsonResponse(
            {"error": "Too many votes. Slow down."},
            status=429
        )

    data = json.loads(request.body or "{}")
    value = data.get("value")

    if value not in (1, -1):
        return JsonResponse({"error": "Invalid vote"}, status=400)

    try:
        comment = Comment.objects.get(id=comment_id, is_hidden=False)
    except Comment.DoesNotExist:
        return JsonResponse({"error": "Comment not found"}, status=404)

    # Create or update vote
    CommentVote.objects.update_or_create(
        user=user,
        comment=comment,
        defaults={"value": value},
    )

    # Recalculate score
    comment.score = (
        CommentVote.objects
        .filter(comment=comment)
        .aggregate(total=Sum("value"))["total"]
        or 0
    )

    # 🔥 Recalculate HOT score
    comment.hot_score = calculate_comment_hot_score(
        comment.score,
        comment.created_at
    )
    comment.save()

    return JsonResponse({
        "comment_id": comment.id,
        "new_score": comment.score,
    })
