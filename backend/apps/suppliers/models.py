from django.db import models
from apps.category.models import Category

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    tax_id = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    payment_terms = models.CharField(max_length=100, blank=True, null=True)
    supply_categories = models.ManyToManyField(Category, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
