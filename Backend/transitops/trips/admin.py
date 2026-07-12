from django.contrib import admin
from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = [
        'trip_number', 'source', 'destination', 'vehicle',
        'driver', 'cargo_weight', 'status', 'created_at',
    ]
    list_filter = ['status']
    search_fields = ['trip_number', 'source', 'destination']
    ordering = ['-created_at']
