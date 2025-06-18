from django.contrib import admin
from .models import Role, Permission, RolePermission

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name']


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'code', 'name', 'description']
    search_fields = ['code', 'name']


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'role', 'permission']
    list_filter = ['role', 'permission']
    search_fields = ['role__name', 'permission__name']
