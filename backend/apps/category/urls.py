from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('create/', CreateCategoryAPIView.as_view(), name='category-create'),
]