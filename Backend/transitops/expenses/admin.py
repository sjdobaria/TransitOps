from django.contrib import admin
from .models import FuelLog, Expense


@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = [
        'vehicle', 'liters', 'cost_per_liter', 'total_cost',
        'date', 'fuel_station', 'created_at',
    ]
    list_filter = ['date']
    search_fields = ['vehicle__registration_number', 'fuel_station']
    ordering = ['-date']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = [
        'vehicle', 'expense_type', 'amount', 'date',
        'receipt_number', 'created_at',
    ]
    list_filter = ['expense_type', 'date']
    search_fields = ['vehicle__registration_number', 'description', 'receipt_number']
    ordering = ['-date']
