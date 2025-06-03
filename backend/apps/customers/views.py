from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Customers
from .serializers import CustomersSerializer

class CustomersViewSet(viewsets.ModelViewSet):
    queryset = Customers.objects.all()
    serializer_class = CustomersSerializer
    permission_classes = [IsAuthenticated]  # 🔐 Requiere autenticación para acceder
