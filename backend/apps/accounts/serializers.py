from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


#definimos una variable 
User = get_user_model()

#Serializer que permite crear un nuevo usuario
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label="Confirm Password"
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'rut', 'phone', 'birth_date',
            'accepted_terms', 'password', 'password2'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        
        if not attrs.get("accepted_terms"):
            raise serializers.ValidationError({"accepted_terms": "Debes aceptar los términos y condiciones."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['name'] = user.first_name
        return token

# USUARIO (lectura, por ejemplo al autenticarse)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'rut', 'phone', 'birth_date',
            'accepted_terms', 'is_active', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['is_active', 'is_staff', 'date_joined']