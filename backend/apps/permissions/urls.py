from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoleViewSet, PermissionViewSet, RolePermissionViewSet

router = DefaultRouter()
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'role-permissions', RolePermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]