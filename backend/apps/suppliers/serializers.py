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

    def validate_email(self, value):
            # Si estamos editando (PUT/PATCH)
        if self.instance:
            # Excluir al cliente actual en la verificación de email único
            if Supplier.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                    raise serializers.ValidationError("Este correo ya existe.")
        else:
            # Si es creación (POST)
            if Supplier.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este correo ya existe.")
            return value
        
    def validate_tax_id(self, value):
        if value:
            if self.instance:
                if Supplier.objects.exclude(pk=self.instance.pk).filter(tax_id=value).exists():
                    raise serializers.ValidationError("Este RUT ya está registrado.")
            else:
                if Supplier.objects.filter(tax_id=value).exists():
                    raise serializers.ValidationError("Este RUT ya está registrado.")
        return value
        
    def validate_tax_id(self, value):
        if value:
            if self.instance:
                if Supplier.objects.exclude(pk=self.instance.pk).filter(phone=value).exists():
                    raise serializers.ValidationError("Este Telefono ya está registrado.")
            else:
                if Supplier.objects.filter(phone=value).exists():
                     raise serializers.ValidationError("Este Telefono ya está registrado.")
        return valueaa