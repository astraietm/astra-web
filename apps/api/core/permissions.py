from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access strictly to authenticated staff/superuser accounts (is_staff = True or is_superuser = True).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return bool(request.user.is_superuser or request.user.is_staff)
