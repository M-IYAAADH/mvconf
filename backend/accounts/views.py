from django.http import JsonResponse

def whoami(request):
    user = getattr(request, "anon_user", None)
    if not user:
        return JsonResponse({"error": "No anonymous user"}, status=400)

    return JsonResponse({
        "id": str(user.id),
        "pseudonym": user.pseudonym
    })
