from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from apps.books.models import Book


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="carts",
        null=True,
        blank=True,
    )
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    checked_out = models.BooleanField(default=False)
    cached_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        if self.user:
            return f"Carrito de {self.user.email} - {self.created_at.strftime('%Y-%m-%d')}"
        return f"Carrito anónimo - {self.created_at.strftime('%Y-%m-%d')}"

    def total_price(self):
        return sum(item.total_price() for item in self.items.all())

    def clean(self):
        if not self.user and not self.session_key:
            raise ValidationError("El carrito debe estar asociado a un usuario o una sesión.")

    def save(self, *args, **kwargs):
        self.full_clean()
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.cached_total = self.total_price()
            super().save(update_fields=["cached_total"])


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('cart', 'book')

    def __str__(self):
        return f"{self.quantity} x {self.book.title}"

    def total_price(self):
        return self.quantity * (self.unit_price if self.unit_price else self.book.final_price)

    def clean(self):
        if self.quantity < 1:
            raise ValidationError("La cantidad debe ser al menos 1.")
        if not self.unit_price:
            self.unit_price = self.book.final_price

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.unit_price:
            self.unit_price = self.book.final_price
        self.subtotal = self.total_price()
        super().save(*args, **kwargs)
        # Actualiza el total del carrito después de guardar
        self.cart.cached_total = self.cart.total_price()
        self.cart.save(update_fields=["cached_total"])
