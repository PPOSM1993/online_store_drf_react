from django.db import models
from django.contrib.auth import get_user_model
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

User = get_user_model()

class Worker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile', null=True, blank=True)

    first_name = models.CharField("Nombre", max_length=100)
    last_name = models.CharField("Apellido", max_length=100)
    tax_id = models.CharField(
        "DNI",
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[rut_validator]
    )
    email = models.EmailField("Correo Electrónico", unique=True)
    phone = models.CharField("Phone", validators=[phone_regex], max_length=17, blank=True, unique=True)
    address = models.CharField("Dirección", max_length=255, blank=True)

    position = models.CharField("Cargo", max_length=100, blank=True)  # Ej: Técnico, Vendedor
    department = models.CharField("Departamento", max_length=100, blank=True)  # Ej: Soporte, Ventas
    salary = models.DecimalField("Sueldo", max_digits=10, decimal_places=2, null=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    contract_type = models.CharField(
        "Tipo de Contrato",
        max_length=50,
        choices=[
            ("indefinido", "Indefinido"),
            ("plazo_fijo", "Plazo fijo"),
            ("honorarios", "Honorarios"),
        ],
        default="indefinido"
    )

    date_joined = models.DateField("Fecha de Ingreso", auto_now_add=True)
    is_active = models.BooleanField("Activo", default=True)
    notes = models.TextField("Notas", blank=True)

    class Meta:
        verbose_name = "Trabajador"
        verbose_name_plural = "Trabajadores"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.rut})"
