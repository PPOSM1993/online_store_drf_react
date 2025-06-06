from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()
    
    def validate_description(self, value):
        if value is not None and len(value) > 500:
            raise serializers.ValidationError("Description cannot exceed 500 characters.")
        return value.strip() if value else value
    
    