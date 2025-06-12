from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Book, Author, Publisher
from .serializers import BookSerializer, AuthorSerializer, PublisherSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
class AuthorListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PublisherAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        publishers = Publisher.objects.all()
        serializer = PublisherSerializer(publishers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.select_related('author', 'publisher', 'category').all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        book = serializer.save()
        # Lógica extra después de guardar (opcional)
        # por ejemplo: log, notificación, recalculo, etc.

    def create(self, request, *args, **kwargs):
        # Validación extra personalizada (opcional)
        if Book.objects.filter(isbn=request.data.get("isbn")).exists():
            return Response({"isbn": "Este ISBN ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Validaciones extra al actualizar (ej: precio negativo, etc.)
        data = request.data
        if float(data.get("purchase_price", 0)) < 0:
            return Response({"purchase_price": "El precio de compra no puede ser negativo."}, status=400)

        return super().update(request, *args, **kwargs)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def SearchBooks(request):
    query = request.GET.get('q', '')
    if query:
        books = Book.objects.filter(
            Q(title__icontains=query) |
            Q(author__name__icontains=query) |
            Q(publisher__name__icontains=query)  # Asumiendo que publisher también es una FK
        ).distinct()
    else:
        books = Book.objects.all()

    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)