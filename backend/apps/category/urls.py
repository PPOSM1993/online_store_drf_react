from django.urls import path
from .views import CategoryListView, CreateCategoryAPIView

urlpatterns = [
    path('/', CategoryListView.as_view(), name='category_list'), # List all categories
    path('create/', CreateCategoryAPIView.as_view(), name='create-customer'),

]
