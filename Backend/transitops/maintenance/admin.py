from django.contrib import admin
from .models import MaintenanceLog


@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = [
        'vehicle', 'maintenance_type', 'cost', 'status',
        'scheduled_date', 'completed_date', 'created_at',
    ]
    list_filter = ['status', 'maintenance_type']
    search_fields = ['vehicle__registration_number', 'description']
    ordering = ['-created_at']
