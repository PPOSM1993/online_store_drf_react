from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator

# Create your models here.

#creamos una clase llamada UserMananger que hereda de BaseUserManager, esta clase se encarga de crear y modificar usuarios, el BaseUserManager contiene 
# metodos para crear usuarios, verificar contraseñas, etc.
class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, rut=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            rut=rut,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, rut, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('accepted_terms', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')

        return self.create_user(email, first_name, last_name, rut, password, **extra_fields)


rut_validator = RegexValidator(
    regex=r'^(\d{7,8})-([\dkK])$',
    message='El RUT debe tener el formato 12345678-5.'
)

#Creamos una clase llamada User que hereda de AbstractBaseUser y PermissionsMixin, esta clase se encarga de crear un usuario, los PermissionsMixin nos permiten 
class User(AbstractBaseUser, PermissionsMixin):
    # Datos básicos, estos datos no viene en el BaseUserManager
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    rut = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[rut_validator]  # Aquí lo usas
    )
    # Extras útiles
    phone = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    accepted_terms = models.BooleanField(default=False)

    # Datos para el sistema
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Opcional: avatar (puedes usarlo luego con Pillow o S3)
    # avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'rut']

    def __str__(self):
        return self.email