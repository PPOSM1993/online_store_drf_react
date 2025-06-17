from django.urls import path
from .views import *

urlpatterns = [
    path('', SupplierListAPIView.as_view(), name='suppliers-list'),  # 👈 ahora es raíz
    path('create/', CreateSupplierAPIView.as_view(), name='create-supplier'),
    path('edit/<int:pk>/', SupplierDetail, name='supplier-detail-or-update'),
    path('delete/<int:pk>/', DeleteSupplier, name='delete-supplier'),
    path('search/', SearchSuppliers, name='search-suppliers'),
]