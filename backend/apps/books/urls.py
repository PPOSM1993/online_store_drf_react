from rest_framework.routers import DefaultRouter
from .views import BookViewSet, AuthorListAPIView
from django.urls import path


router = DefaultRouter()
router.register(r'', BookViewSet, basename='books')
urlpatterns = router.urls

urlpatterns = [
    path('author/', AuthorListAPIView.as_view(), name='author_list'),
]