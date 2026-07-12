from django.contrib import admin
from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = [
        'registration_number', 'name', 'vehicle_type',
        'max_load_capacity', 'status', 'region', 'created_at',
    ]
    list_filter = ['vehicle_type', 'status', 'region']
    search_fields = ['registration_number', 'name']
    ordering = ['-created_at']
