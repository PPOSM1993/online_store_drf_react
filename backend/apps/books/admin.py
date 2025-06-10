from django.contrib import admin
from .models import Author, Publisher, Book
from apps.category.models import Category
from .models import Author

# Register your models here.

@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'bio')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publisher', 'isbn', 'purchase_price', 'vat_percentage', 'final_price', 'stock', 'is_featured')
    search_fields = ('title', 'isbn', 'author__name', 'publisher__name')
    list_filter = ('category', 'language', 'publisher', 'author')