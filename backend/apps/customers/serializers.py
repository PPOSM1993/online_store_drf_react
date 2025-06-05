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
class CustomersSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    city = CitySerializer(read_only=True)

    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True, required=False
    )
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True, required=False
    )

    class Meta:
        model = Customers
        fields = [
            'id',
            'customer_type',
            'full_name',
            'tax_id',
            'company',
            'business_activity',
            'email',
            'phone',
            'address',
            'region', 'region_id',
            'city', 'city_id',
        ]

    def validate_email(self, value):
        if Customers.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya existe.")
        return value

    def validate(self, data):
        tipo = data.get('customer_type')

        if tipo == 'individual' and not data.get('full_name'):
            raise serializers.ValidationError("El nombre es obligatorio para clientes individuales.")
        
        if tipo == 'company' and not data.get('company'):
            raise serializers.ValidationError("La razón social es obligatoria para empresas.")

        region = data.get('region')
        city = data.get('city')

        if region and not city:
            raise serializers.ValidationError("Debe elegir una ciudad si selecciona una región.")

        return data