from rest_framework import serializers
from stdnum import isbn
from .models import Book, Author, Publisher

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'  # O puedes listar los campos explícitamente si prefieres

    def validate_isbn(self, value):
        """Validación con la librería python-stdnum"""
        try:
            value = value.replace('-', '').strip()
            if not isbn.is_valid(value):
                raise serializers.ValidationError("El ISBN no es válido.")
        except Exception:
            raise serializers.ValidationError("Formato de ISBN inválido.")
        return isbn.compact(value)  # devuelve el ISBN limpio

    def validate_purchase_price(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio de compra no puede ser negativo.")
        return value

    def validate_vat_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("El IVA debe estar entre 0 y 100.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']
        
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del autor no puede estar vacío.")
        return value.strip()


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ['id', 'name']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre de la editorial no puede estar vacío.")
        return value.strip()