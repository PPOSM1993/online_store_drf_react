from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateSupplierAPIView(CreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteSupplier(request, pk):
    try:
        supplier = Supplier.objects.get(pk=pk)
    except Supplier.DoesNotExist:
        return Response({"error": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    supplier.delete()
    return Response({"message": "Proveedor eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def SearchSuppliers(request):
    query = request.GET.get('q', '')
    if query:
        suppliers = Supplier.objects.filter(
            name__icontains=query
        ) | Supplier.objects.filter(
            tax_id__icontains=query
        ) | Supplier.objects.filter(
            email__icontains=query
        )
    else:
        suppliers = Supplier.objects.all()

    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def SupplierDetail(request, pk):
    try:
        supplier = Supplier.objects.get(pk=pk)
    except Supplier.DoesNotExist:
        return Response({"error": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SupplierSerializer(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
