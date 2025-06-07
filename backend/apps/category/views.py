from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Category
from .serializers import CategorySerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes


class CategoryListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = Category.objects.all()
        serializer = CategorySerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateCategoryAPIView(CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def SearchCategories(request):
    query = request.GET.get('q', '')
    if query:
        categories = Category.objects.filter(
            name__icontains=query
        )| Category.objects.filter(
            description__icontains=query  
        )
    else:
        categories = Category.objects.all()

    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteCategories(request, pk):
    try:
        categories = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({"error": "Categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    categories.delete()
    return Response({"message": "Categoria eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)
