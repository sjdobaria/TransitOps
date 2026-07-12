from rest_framework import serializers
from django.utils import timezone

from vehicles.serializers import VehicleListSerializer
from .models import MaintenanceLog


class MaintenanceLogSerializer(serializers.ModelSerializer):
    """Full maintenance log serializer."""

    vehicle_detail = VehicleListSerializer(source='vehicle', read_only=True)

    class Meta:
        model = MaintenanceLog
        fields = [
            'id', 'vehicle', 'vehicle_detail', 'maintenance_type',
            'description', 'cost', 'status', 'scheduled_date',
            'completed_date', 'mechanic_name', 'service_center',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_cost(self, value):
        if value < 0:
            raise serializers.ValidationError('Cost cannot be negative.')
        return value

    def validate(self, attrs):
        vehicle = attrs.get('vehicle')
        if vehicle and vehicle.status == 'on_trip':
            raise serializers.ValidationError({
                'vehicle': 'Cannot create maintenance for a vehicle currently on a trip.'
            })
        return attrs


class MaintenanceCloseSerializer(serializers.Serializer):
    """Serializer for closing a maintenance record."""

    cost = serializers.FloatField(required=False)
    completed_date = serializers.DateField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)


class MaintenanceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    vehicle_reg = serializers.CharField(source='vehicle.registration_number', read_only=True)
    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)

    class Meta:
        model = MaintenanceLog
        fields = [
            'id', 'vehicle', 'vehicle_reg', 'vehicle_name',
            'maintenance_type', 'cost', 'status',
            'scheduled_date', 'completed_date', 'created_at',
        ]
