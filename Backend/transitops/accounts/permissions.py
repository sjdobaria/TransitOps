from rest_framework import permissions


class IsFleetManager(permissions.BasePermission):
    """Allows access only to Fleet Manager or Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('fleet_manager', 'admin')
        )


class IsDispatcher(permissions.BasePermission):
    """Allows access only to Dispatcher, Driver, or Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('dispatcher', 'driver', 'admin')
        )


class IsSafetyOfficer(permissions.BasePermission):
    """Allows access only to Safety Officer or Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('safety_officer', 'admin')
        )


class IsFinancialAnalyst(permissions.BasePermission):
    """Allows access only to Financial Analyst or Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('financial_analyst', 'admin')
        )


class IsFleetManagerOrReadOnly(permissions.BasePermission):
    """Fleet Manager/Admin can write; all authenticated users can read."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('fleet_manager', 'admin')
        )


class IsDispatcherOrFleetManager(permissions.BasePermission):
    """Allows Dispatcher, Driver, Fleet Manager, or Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('dispatcher', 'driver', 'fleet_manager', 'admin')
        )


class IsAnyRole(permissions.BasePermission):
    """Allows any authenticated user regardless of role."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
