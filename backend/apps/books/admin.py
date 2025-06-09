from django.contrib import admin
from django.http import HttpResponse
import csv
from .models import Author, Books, Editorial, Category


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'bio')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Books)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'author', 'isbn', 'purchase_price',
        'vat_percentage', 'final_price', 'stock',
        'category', 'editorial', 'language', 'publication_date', 'is_featured'
    )
    list_filter = (
        'category', 'editorial', 'language', 'is_featured',
        ('purchase_price', admin.AllValuesFieldListFilter)
    )
    search_fields = ('title', 'isbn', 'author__name')
    ordering = ('title',)
    readonly_fields = ('final_price',)
    autocomplete_fields = ('author', 'category', 'editorial')
    actions = ['export_books_to_csv', 'mark_as_featured']

    fieldsets = (
        (None, {
            'fields': ('title', 'author', 'isbn', 'description')
        }),
        ('Datos de precio', {
            'fields': ('purchase_price', 'vat_percentage', 'final_price', 'stock')
        }),
        ('Metadatos', {
            'fields': ('category', 'editorial', 'language', 'publication_date', 'is_featured')
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
                book.editorial.name if book.editorial else ''
            ])

        return response

    @admin.action(description="Marcar como destacados")
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} libros marcados como destacados.")


@admin.register(Editorial)
class EditorialAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
