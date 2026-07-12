from django.db import models
from vehicles.models import Vehicle
from trips.models import Trip


class FuelLog(models.Model):
    """Fuel consumption log."""

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name='fuel_logs'
    )
    trip = models.ForeignKey(
        Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='fuel_logs'
    )
    liters = models.FloatField(help_text='Fuel quantity in liters')
    cost_per_liter = models.FloatField(help_text='Cost per liter')
    total_cost = models.FloatField(editable=False, default=0)
    odometer_reading = models.FloatField(null=True, blank=True)
    date = models.DateField()
    fuel_station = models.CharField(max_length=200, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fuel_logs'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.liters}L on {self.date}"

    def save(self, *args, **kwargs):
        self.total_cost = round(self.liters * self.cost_per_liter, 2)
        super().save(*args, **kwargs)


class Expense(models.Model):
    """General expense record."""

    TYPE_CHOICES = [
        ('toll', 'Toll'),
        ('parking', 'Parking'),
        ('insurance', 'Insurance'),
        ('registration', 'Registration'),
        ('fine', 'Fine'),
        ('repair', 'Repair'),
        ('cleaning', 'Cleaning'),
        ('other', 'Other'),
    ]

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, null=True, blank=True, related_name='expenses'
    )
    trip = models.ForeignKey(
        Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses'
    )
    expense_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.FloatField()
    date = models.DateField()
    description = models.TextField(blank=True, default='')
    receipt_number = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'expenses'
        ordering = ['-date', '-created_at']

    def __str__(self):
        vehicle_str = self.vehicle.registration_number if self.vehicle else 'General'
        return f"{vehicle_str} - {self.get_expense_type_display()} - {self.amount}"
