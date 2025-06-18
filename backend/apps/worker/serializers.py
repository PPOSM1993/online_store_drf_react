from rest_framework import serializers
from .models import Worker, Region, City

class WorkerSerializer(serializers.ModelSerializer):
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True
    )
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )

    region = serializers.StringRelatedField(read_only=True)
    city = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Worker
        fields = [
            'id',
            'full_name',
            'tax_id',
            'email',
            'phone',
            'address',
            'position',
            'department',
            'salary',
            'contract_type',
            'date_joined',
            'is_active',
            'notes',
            'user',
            'region', 
            'region_id',
            'city', 
            'city_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['date_joined', 'id', 'created_at', 'updated_at']

    def validate_email(self, value):
        if self.instance:
            if Worker.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Este correo ya existe.")
        else:
            if Worker.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este correo ya existe.")
        return value

    def validate_tax_id(self, value):
        if value:
            if self.instance:
                if Worker.objects.exclude(pk=self.instance.pk).filter(tax_id=value).exists():
                    raise serializers.ValidationError("Este RUT ya está registrado.")
            else:
                if Worker.objects.filter(tax_id=value).exists():
                    raise serializers.ValidationError("Este RUT ya está registrado.")
        return value

    def validate_phone(self, value):
        if value:
            if self.instance:
                if Worker.objects.exclude(pk=self.instance.pk).filter(phone=value).exists():
                    raise serializers.ValidationError("Este teléfono ya está registrado.")
            else:
                if Worker.objects.filter(phone=value).exists():
                    raise serializers.ValidationError("Este teléfono ya está registrado.")
        return value

    def validate(self, data):
        region = data.get('region')
        city = data.get('city')
        if region and not city:
            raise serializers.ValidationError("Debe elegir una ciudad si selecciona una región.")
        return data

