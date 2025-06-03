"""from django.contrib import admin
from .models import Customers, Region, City

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'region')

@admin.register(Customers)
class CustomersAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'region', 'city', 'email')"""
    
from django.contrib import admin
from .models import Customers

@admin.register(Customers)
class CustomersAdmin(admin.ModelAdmin):
    pass