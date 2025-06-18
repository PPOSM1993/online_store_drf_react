from django.urls import path
from .views import *

urlpatterns = [
    path('', WorkersListAPIView.as_view(), name='worker-list'),  # 👈 ahora es raíz
    path('create/', WorkerCustomerAPIView.as_view(), name='create-worker'),
    path('edit/<int:pk>/', WorkerDetail, name='worker-detail-or-update'),
    path('delete/<int:pk>/', DeleteWorker, name='delete-worker'),
    path('search/', SearchWorker, name='search-worker'),
]