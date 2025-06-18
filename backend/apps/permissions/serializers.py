from rest_framework import serializers
from .models import Role, Permission, RolePermission

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'code', 'name', 'description']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']


class RolePermissionSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), source='role', write_only=True)

    permission = PermissionSerializer(read_only=True)
    permission_id = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), source='permission', write_only=True)

    class Meta:
        model = RolePermission
        fields = ['id', 'role', 'role_id', 'permission', 'permission_id']
