from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Worker
from .serializers import WorkerSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes


class WorkersListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = Worker.objects.all()
        serializer = WorkerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkerCustomerAPIView(CreateAPIView):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [IsAuthenticated]
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteWorker(request, pk):
    try:
        worker = Worker.objects.get(pk=pk)
    except Worker.DoesNotExist:
        return Response({"error": "Trabajador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    worker.delete()
    return Response({"message": "Trabajador eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def SearchWorker(request):
    query = request.GET.get('q', '')
    if query:
        worker = Worker.objects.filter(
            full_name__icontains=query
        ) | Worker.objects.filter(
            tax_id__icontains=query  
        ) | Worker.objects.filter(
            email__icontains=query
        ) | Worker.objects.filter(
            phone__icontains=query
        ) | Worker.objects.filter(
            address__icontains=query
        )
    else:
        worker = Worker.objects.all()

    serializer = WorkerSerializer(worker, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def WorkerDetail(request, pk):
    try:
        worker = Worker.objects.get(pk=pk)
    except Worker.DoesNotExist:
        return Response({"error": "Trabajador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WorkerSerializer(worker)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = Worker(worker, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)