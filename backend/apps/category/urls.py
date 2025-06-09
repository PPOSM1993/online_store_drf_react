from django.urls import path
from .views import *

urlpatterns = [
    path('', CategoryListAPIView.as_view(), name='category_list'), # List all categories
    path('create/', CreateCategoryAPIView.as_view(), name='create-category'), # Create a new category
    path('delete/<int:pk>/', DeleteCategories, name='delete-categories'),
    path('search/', SearchCategories, name='search-categories'),
    path('edit/<int:pk>/', CategoryDetail, name='customer-detail-or-update'),
]
