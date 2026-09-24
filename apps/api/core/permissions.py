from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access to users who are:
    - is_superuser = True
    - is_staff = True
    - Or belong to the 'Admin' group in Django
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return bool(
            request.user.is_superuser or 
            request.user.is_staff or 
            request.user.groups.filter(name__iexact='Admin').exists()
        )

class IsSuperUser(permissions.BasePermission):
    """
    Allows access ONLY to superusers.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return bool(request.user.is_superuser)

