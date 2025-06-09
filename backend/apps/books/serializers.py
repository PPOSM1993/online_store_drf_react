from rest_framework import serializers
from .models import Books, Author
from stdnum import isbn

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio']

class EditorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books.editorial.field.related_model
        fields = ['id', 'name', 'website', 'country']

class BookSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    editorial = serializers.PrimaryKeyRelatedField(
        queryset=Books.editorial.field.related_model.objects.all(),
        required=False
    )

    class Meta:
        model = Books
        fields = [
            'id',
            'title',
            'author',
            'isbn',
            'purchase_price',
            'vat_percentage',
            'final_price',
            'discount_percentage',
            'description',
            'is_featured',
            'stock',
            'category',
            'editorial',
            'language',
            'pages',
            'publication_date',
            'cover_image',
        ]
        read_only_fields = ['id', 'final_price']

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
    def validate_description(self, value):
        if value is not None and len(value) > 2500:
            raise serializers.ValidationError("Description cannot exceed 2500 characters.")
        return value.strip() if value else value

