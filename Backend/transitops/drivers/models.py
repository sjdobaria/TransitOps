from django.db import models
from django.utils import timezone


class Driver(models.Model):
    """Driver profile model."""

    LICENSE_CATEGORY_CHOICES = [
        ('A', 'Category A - Motorcycle'),
        ('B', 'Category B - Light Vehicle'),
        ('C', 'Category C - Heavy Vehicle'),
        ('D', 'Category D - Passenger Vehicle'),
        ('E', 'Category E - Articulated Vehicle'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('off_duty', 'Off Duty'),
        ('suspended', 'Suspended'),
    ]

    name = models.CharField(max_length=150)
    license_number = models.CharField(max_length=50, unique=True)
    license_category = models.CharField(max_length=5, choices=LICENSE_CATEGORY_CHOICES)
    license_expiry_date = models.DateField()
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, default='')
    safety_score = models.FloatField(
        default=100.0,
        help_text='Safety score from 0 to 100. Higher is better.',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    date_of_birth = models.DateField(null=True, blank=True)
    hired_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'drivers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.license_number})"

    @property
    def is_license_expired(self):
        """Check if the driver's license has expired."""
        return self.license_expiry_date < timezone.now().date()

    @property
    def is_license_expiring_soon(self):
        """Check if the license expires within the next 30 days."""
        today = timezone.now().date()
        days_until_expiry = (self.license_expiry_date - today).days
        return 0 <= days_until_expiry <= 30

    @property
    def is_available_for_dispatch(self):
        """Check if driver can be assigned to a trip."""
        return (
            self.status == 'available'
            and not self.is_license_expired
        )
