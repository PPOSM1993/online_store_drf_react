from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Customers
from .serializers import CustomersSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

class CustomersListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = Customers.objects.all()
        serializer = CustomersSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateCustomerAPIView(CreateAPIView):
    queryset = Customers.objects.all()
    serializer_class = CustomersSerializer
    permission_classes = [IsAuthenticated]