from django.contrib import admin
from django.http import HttpResponse
from .models import Author, Publisher, Book
from apps.category.models import Category
from .models import Author
import csv

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

    list_display = (
        'title', 'author', 'isbn', 'purchase_price',
        'vat_percentage', 'final_price', 'stock',
        'publisher', 'language', 'publication_date', 'is_featured'
    )
    list_filter = ('publisher', 'language')
    search_fields = ('title', 'isbn', 'author__name')
    ordering = ('title',)
    readonly_fields = ('final_price',)
    autocomplete_fields = ('author', 'publisher')
    actions = ['export_books_to_csv']

    fieldsets = (
        (None, {
            'fields': ('title', 'author', 'isbn', 'description')
        }),
        ('Datos de precio', {
            'fields': ('purchase_price', 'vat_percentage', 'final_price', 'stock')
        }),
        ('Metadatos', {
            'fields': ('category', 'publisher', 'language', 'publication_date', 'is_featured')
        }),
    )

    @admin.action(description="Exportar libros seleccionados a CSV")
    def export_books_to_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="libros.csv"'

        writer = csv.writer(response)
        writer.writerow(['Título', 'Autor', 'ISBN', 'Precio Compra', 'IVA (%)', 'Precio Final', 'Stock', 'Editorial'])

        for book in queryset:
            writer.writerow([
                book.title,
                book.author.name,
                book.isbn,
                book.purchase_price,
                book.vat_percentage,
                book.final_price,
                book.stock,
                book.publisher.name if book.publisher else ''
            ])
            
            return response

    @admin.action(description="Marcar como destacados")
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} libros marcados como destacados.")