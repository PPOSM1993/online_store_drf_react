from django.urls import path
from .views import CustomersListAPIView

urlpatterns = [
    path('', CustomersListAPIView.as_view(), name='customers-list'),  # 👈 ahora es raíz
]