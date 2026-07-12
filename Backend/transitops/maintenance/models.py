from django.db import models
from vehicles.models import Vehicle


class MaintenanceLog(models.Model):
    """Maintenance record model with automatic vehicle status management."""

    TYPE_CHOICES = [
        ('oil_change', 'Oil Change'),
        ('tire_replacement', 'Tire Replacement'),
        ('engine_repair', 'Engine Repair'),
        ('brake_service', 'Brake Service'),
        ('general_service', 'General Service'),
        ('transmission', 'Transmission'),
        ('electrical', 'Electrical'),
        ('body_work', 'Body Work'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name='maintenance_logs'
    )
    maintenance_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField(blank=True, default='')
    cost = models.FloatField(default=0, help_text='Maintenance cost')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    mechanic_name = models.CharField(max_length=100, blank=True, default='')
    service_center = models.CharField(max_length=200, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maintenance_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.get_maintenance_type_display()}"
