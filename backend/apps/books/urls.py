from rest_framework.routers import DefaultRouter
from .views import BookViewSet, AuthorListAPIView, PublisherAPIView, SearchBooks
from django.urls import path

router = DefaultRouter()
router.register(r'', BookViewSet, basename='books')

urlpatterns = router.urls + [
    path('author/', AuthorListAPIView.as_view(), name='author_list'),
    path('publisher/', PublisherAPIView.as_view(), name='publisher_list'),
    path('search/', SearchBooks, name='search-customers'),
]
