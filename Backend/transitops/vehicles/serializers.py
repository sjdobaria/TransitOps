from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    """Full vehicle serializer for CRUD operations."""

    is_available_for_dispatch = serializers.ReadOnlyField()

    class Meta:
        model = Vehicle
        fields = [
            'id', 'registration_number', 'name', 'vehicle_type',
            'max_load_capacity', 'current_odometer', 'acquisition_cost',
            'status', 'region', 'acquisition_date', 'notes',
            'is_available_for_dispatch', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_registration_number(self, value):
        """Ensure registration number is unique (case-insensitive)."""
        value = value.upper().strip()
        qs = Vehicle.objects.filter(registration_number=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                'A vehicle with this registration number already exists.'
            )
        return value

    def validate_max_load_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError('Max load capacity must be positive.')
        return value

    def validate_acquisition_cost(self, value):
        if value < 0:
            raise serializers.ValidationError('Acquisition cost cannot be negative.')
        return value

    def validate_current_odometer(self, value):
        if value < 0:
            raise serializers.ValidationError('Odometer reading cannot be negative.')
        return value


class VehicleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views and dropdowns."""

    class Meta:
        model = Vehicle
        fields = [
            'id', 'registration_number', 'name', 'vehicle_type',
            'max_load_capacity', 'status', 'region',
        ]
