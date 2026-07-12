from django.db import models


class Vehicle(models.Model):
    """Vehicle registry model."""

    TYPE_CHOICES = [
        ('truck', 'Truck'),
        ('van', 'Van'),
        ('bus', 'Bus'),
        ('car', 'Car'),
        ('motorcycle', 'Motorcycle'),
        ('trailer', 'Trailer'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('in_shop', 'In Shop'),
        ('retired', 'Retired'),
    ]

    registration_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, help_text='Vehicle name or model')
    vehicle_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    max_load_capacity = models.FloatField(help_text='Maximum load capacity in kg')
    current_odometer = models.FloatField(default=0, help_text='Current odometer reading in km')
    acquisition_cost = models.FloatField(default=0, help_text='Acquisition cost in currency')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    region = models.CharField(max_length=100, blank=True, default='')
    acquisition_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicles'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.registration_number} - {self.name}"

    @property
    def is_available_for_dispatch(self):
        """Check if vehicle can be assigned to a trip."""
        return self.status == 'available'
