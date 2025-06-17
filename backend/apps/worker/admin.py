from django.contrib import admin
from .models import Worker

@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = (
        'first_name', 'last_name', 'tax_id', 'email', 'region', 'city',
        'phone', 'position', 'department', 'contract_type', 'is_active'
    )
    list_filter = ('department', 'contract_type', 'is_active')
    search_fields = ('first_name', 'last_name', 'tax_id', 'email', 'position')
    ordering = ('last_name', 'first_name')
    readonly_fields = ('date_joined',)

    fieldsets = (
        ("Datos Personales", {
            "fields": ('first_name', 'last_name', 'tax_id', 'email', 'phone', 'address', 'region', 'city')
        }),
        ("Información Laboral", {
            "fields": ('position', 'department', 'salary', 'contract_type', 'date_joined')
        }),
        ("Opcionales", {
            "fields": ('is_active', 'notes', 'user')
        }),
    )
