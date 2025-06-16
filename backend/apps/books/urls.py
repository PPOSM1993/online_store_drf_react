from rest_framework.routers import DefaultRouter
from .views import CreateBookAPIView, AuthorListAPIView, PublisherAPIView, SearchBooks
from django.urls import path


router = DefaultRouter()
#router.register(r'create', BookViewSet, basename='books')
urlpatterns = router.urls

urlpatterns = [
    path('create/', CreateBookAPIView.as_view(), name='create_book'),
    path('author/', AuthorListAPIView.as_view(), name='author_list'),
    path('publisher/', PublisherAPIView.as_view(), name='publisher_list'),
    path('search/', SearchBooks, name='search-books'),
]
