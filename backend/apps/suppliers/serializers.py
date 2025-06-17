from rest_framework import serializers
from .models import *

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']

class CitySerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True
    )

    class Meta:
        model = City
        fields = ['id', 'name', 'region', 'region_id']

class SupplierSerializer(serializers.ModelSerializer):
    # Opcional: mostrar nombres legibles en la representación    

    region = RegionSerializer(read_only=True)
    city = CitySerializer(read_only=True)

    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True, required=False
    )
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True, required=False
    )

    class Meta:
        model = Supplier
        fields = [
            'id',
            'name',
            'tax_id',
            'email',
            'phone',
            'address',
            'contact_person',
            'website',
            'notes',
            'is_active',
            'payment_terms',
            'region',
            'region_id',
            'city',
            'city_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del proveedor no puede estar vacío.")
        return value

    def validate_tax_id(self, value):
        if not value.strip():
            raise serializers.ValidationError("El RUT no puede estar vacío.")
        return value

    def validate_email(self, value):
        if not value.strip():
            raise serializers.ValidationError("El correo electrónico es obligatorio.")
        return value.lower()

    def validate_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError("El teléfono es obligatorio.")
        return value
