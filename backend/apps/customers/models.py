from django.db import models
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

# Cliente (Persona natural o empresa)
# Cliente (Persona natural o empresa)
class Customers(models.Model):
    CUSTOMER_TYPE_CHOICES = [
        ('individual', 'Persona'),
        ('company', 'Empresa'),
    ]

    customer_type = models.CharField(
        max_length=10,
        choices=CUSTOMER_TYPE_CHOICES,
        verbose_name="Customer Type"
    )

    # Datos personales o empresa
    first_name = models.CharField("Full Name", max_length=100, blank=True, null=True)
    last_name = models.CharField("Last Name", max_length=100, blank=True, null=True)
    company = models.CharField("Company Name", max_length=150, blank=True, null=True)

    tax_id = models.CharField(
        "DNI",
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[rut_validator]
    )

    business_activity = models.CharField(
        "Bussiness Activity",
        max_length=50,
        blank=True,
        null=True
    )

    # Contacto
    email = models.EmailField("Email", unique=True)
    phone = models.CharField("Phone", validators=[phone_regex], max_length=17, blank=True, unique=True)
    address = models.CharField("Address", max_length=255, blank=True, null=True)

    # Ubicación geográfica
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    # Campo de fecha de creación correctamente definido
    created_at = models.DateTimeField("Created at", default=timezone.now)

    def __str__(self):
        if self.customer_type == 'company' and self.company:
            return self.company
        return self.first_name or "Cliente sin nombre"