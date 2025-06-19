from rest_framework import serializers
from apps.books.models import Book
from apps.books.serializers import BookSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='book', write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_id', 'quantity', 'unit_price', 'subtotal']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("La cantidad debe ser al menos 1.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'updated_at', 'checked_out', 'items', 'total']
        read_only_fields = ['user', 'created_at', 'updated_at', 'total', 'checked_out']

    def get_total(self, obj):
        return obj.total_price()
