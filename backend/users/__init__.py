from rest_framework.permissions import BasePermission

from users.constants import UserRole, UserGroup


def check_humanity_permissions(user, role_permission):
    if user.is_superuser:
        return True
    if user.role == UserRole.SUPER_ADMIN.value:
        return True
    if role_permission == UserRole.ADMIN.value and user.role == role_permission:
        return True
    if role_permission == UserRole.SUPERVISOR.value and (user.role == role_permission or user.role == UserRole.ADMIN.value):
        return True
    if role_permission == UserRole.EMPLOYEE.value and (user.role == role_permission or user.role == UserRole.ADMIN.value or user.role == UserRole.SUPERVISOR.value):
        return True
    return False


class IsProgramManagerSuperAdmin(BasePermission):

    def has_permission(self, request, view):
        return check_humanity_permissions(request.user, UserRole.SUPER_ADMIN.value)


class IsProgramManagerAdmin(IsProgramManagerSuperAdmin):

    def has_permission(self, request, view):
        return check_humanity_permissions(request.user, UserRole.ADMIN.value)


class IsBankSupervisor(BasePermission):

    def has_permission(self, request, view):
        return check_humanity_permissions(request.user, UserRole.SUPERVISOR.value)


class IsBankEmployee(BasePermission):

    def has_permission(self, request, view):
        return check_humanity_permissions(request.user, UserRole.EMPLOYEE.value)