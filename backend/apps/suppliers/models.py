from django.db import models
from apps.category.models import Category
from django.core.validators import RegexValidator
from django.utils import timezone


created_at = models.DateTimeField(default=timezone.now)

# Validadores
rut_validator = RegexValidator(
    regex=r'^(\d{7,8})-([\dkK])$',
    message='El RUT debe tener el formato 12345678-5.'
)

phone_regex = RegexValidator(
    regex=r'^(\+56)?\s?9\d{8}$',
    message="Ingrese un número de teléfono válido. Ejemplo: +56912345678 o 912345678."
)

# Región (Ej: Región Metropolitana)
class Region(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Ciudad (Ej: Santiago)
class City(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    tax_id = models.CharField(
        "DNI",
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[rut_validator]
    )
    email = models.EmailField(unique=True)
    phone = models.CharField("Phone", validators=[phone_regex], max_length=17, blank=True, unique=True)
    address = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    payment_terms = models.CharField(max_length=100, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Supplier"
        verbose_name_plural = "Suppliers"
        ordering = ['name']
