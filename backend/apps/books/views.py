from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Book, Author, Publisher
from .serializers import *


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