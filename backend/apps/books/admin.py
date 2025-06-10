from django.contrib import admin
from .models import Author, Editorial, Book
from apps.category.models import Category
from .models import Author

# Register your models here.




@admin.register(Editorial)
class EditorialAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'bio')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'author', 'isbn', 'purchase_price',
        'vat_percentage', 'final_price', 'stock',
        'editorial', 'language', 'publication_date'
    )
    list_filter = ('editorial', 'language')
    search_fields = ('title', 'isbn', 'author__name', )
    ordering = ('title',)
    readonly_fields = ('final_price',)
    autocomplete_fields = ('author', 'editorial')