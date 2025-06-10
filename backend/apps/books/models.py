from django.db import models
from stdnum import isbn
from django.core.exceptions import ValidationError
from apps.category.models import Category  # Usa tu modelo Category existente


def validate_isbn(value):
    if not isbn.is_valid(value):
        raise ValidationError("ISBN inválido.")

class Author(models.Model):
    name = models.CharField(max_length=255, unique=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True)
    website = models.URLField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    isbn = models.CharField(max_length=20, unique=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    vat_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='books')
    language = models.CharField(max_length=50)
    pages = models.PositiveIntegerField()
    is_featured = models.BooleanField(default=False)
    publication_date = models.DateField()
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)


    def save(self, *args, **kwargs):
        # Cálculo de precio final con IVA y descuento si aplica
        price_with_vat = self.purchase_price * (1 + (self.vat_percentage / 100))
        discounted_price = price_with_vat * (1 - (self.discount_percentage / 100))
        self.final_price = round(discounted_price, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title