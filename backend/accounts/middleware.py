from .models import AnonymousUser
from .utils import generate_pseudonym
from .security import hash_ip

class AnonymousUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        anon_id = request.COOKIES.get("anon_id")

        if not anon_id:
            ip = request.META.get("REMOTE_ADDR", "")
            ip_hash = hash_ip(ip)

            pseudonym = generate_pseudonym()
            anon_user = AnonymousUser.objects.create(
                pseudonym=pseudonym,
                ip_hash=ip_hash
            )

            request.anon_user = anon_user
            response = self.get_response(request)
            response.set_cookie(
                "anon_id",
                str(anon_user.id),
                httponly=True,
                samesite="Lax"
            )
            return response

        try:
            request.anon_user = AnonymousUser.objects.get(id=anon_id)
        except AnonymousUser.DoesNotExist:
            request.anon_user = None

        return self.get_response(request)
