from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Customers
from .serializers import CustomersSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes


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
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteCustomer(request, pk):
    try:
        customer = Customers.objects.get(pk=pk)
    except Customers.DoesNotExist:
        return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    customer.delete()
    return Response({"message": "Cliente eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def SearchCustomers(request):
    query = request.GET.get('q', '')
    if query:
        customers = Customers.objects.filter(
            full_name__icontains=query
        ) | Customers.objects.filter(
            company__icontains=query  
        ) | Customers.objects.filter(
            tax_id__icontains=query
        ) | Customers.objects.filter(
            phone__icontains=query
        )
    else:
        customers = Customers.objects.all()

    serializer = CustomersSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def CustomerDetail(request, pk):
    try:
        customer = Customers.objects.get(pk=pk)
    except Customers.DoesNotExist:
        return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomersSerializer(customer)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CustomersSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)