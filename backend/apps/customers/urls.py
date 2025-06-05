from django.urls import path
from .views import *

urlpatterns = [
    path('', CustomersListAPIView.as_view(), name='customers-list'),  # 👈 ahora es raíz
    path('create/', CreateCustomerAPIView.as_view(), name='create-customer'),
    path('delete/<int:pk>/', DeleteCustomer, name='delete-customer'),
    path('search/', SearchCustomers, name='search-customers'),


]