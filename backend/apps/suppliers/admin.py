from django.contrib import admin
from .models import *
@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'tax_id', 'email', 'phone', 'is_active')
    search_fields = ('name', 'tax_id', 'email')
    list_filter = ('is_active', 'region', 'city')
    filter_horizontal = ('supply_categories',)

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'region')
    list_filter = ('region',)
    search_fields = ('name',)
