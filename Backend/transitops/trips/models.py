import uuid
from django.db import models
from vehicles.models import Vehicle
from drivers.models import Driver


class Trip(models.Model):
    """Trip management model with full lifecycle tracking."""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    trip_number = models.CharField(max_length=20, unique=True, editable=False)
    source = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.PROTECT, related_name='trips'
    )
    driver = models.ForeignKey(
        Driver, on_delete=models.PROTECT, related_name='trips'
    )
    cargo_weight = models.FloatField(help_text='Cargo weight in kg')
    planned_distance = models.FloatField(help_text='Planned distance in km')
    actual_distance = models.FloatField(null=True, blank=True, help_text='Actual distance in km')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_odometer = models.FloatField(null=True, blank=True)
    end_odometer = models.FloatField(null=True, blank=True)
    fuel_consumed = models.FloatField(null=True, blank=True, help_text='Fuel consumed in liters')
    revenue = models.FloatField(default=0, help_text='Revenue earned from this trip')
    notes = models.TextField(blank=True, default='')
    dispatched_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'trips'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.trip_number}: {self.source} → {self.destination}"

    def save(self, *args, **kwargs):
        if not self.trip_number:
            # Auto-generate trip number: TRP-0001, TRP-0002, etc.
            last_trip = Trip.objects.order_by('-created_at').first()
            if last_trip and last_trip.trip_number.startswith('TRP-'):
                try:
                    last_num = int(last_trip.trip_number.split('-')[1])
                    self.trip_number = f"TRP-{last_num + 1:04d}"
                except (ValueError, IndexError):
                    self.trip_number = f"TRP-{uuid.uuid4().hex[:6].upper()}"
            else:
                self.trip_number = 'TRP-0001'
        super().save(*args, **kwargs)
