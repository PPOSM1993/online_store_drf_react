from django.db import models
from django.core.validators import RegexValidator

# Create your models here.


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


class City(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        return f"{self.name}, {self.region.name}"


class Commune(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='communes')

    def __str__(self):
        return f"{self.name}, {self.city.name}"

class Customers(models.Model):
    
    CUSTOMER_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('company', 'Company'),
    ]
    
    customer_type = models.CharField(max_length=10, choices=CUSTOMER_TYPE_CHOICES)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    tax_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[rut_validator]  # Chilean Formatter
    )
    company_name = models.CharField(max_length=150, blank=True, null=True) #equivale a razon social
    
    #BUSINESS_ACTIVITY_CHOICES = [
    #    ('retail', 'Retail'),
    #    ('services', 'Services'),
    #    ('manufacturing', 'Manufacturing'),
    #    ('technology', 'Technology'),
    #    ('construction', 'Construction'),
    #    # agrega los que necesites
    #]

    business_activity = models.CharField(max_length=50, 
                                         #choices=BUSINESS_ACTIVITY_CHOICES, 
                                         blank=True, null=True) #Equivale a Giro Comercial

    email = models.EmailField(unique=True)
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    # Relaciones geográficas
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    commune = models.ForeignKey(Commune, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)