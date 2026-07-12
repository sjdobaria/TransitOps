from rest_framework import serializers
from django.utils import timezone

from vehicles.serializers import VehicleListSerializer
from drivers.serializers import DriverListSerializer
from vehicles.models import Vehicle
from drivers.models import Driver
from .models import Trip


class TripCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new trip with full business rule validation."""

    class Meta:
        model = Trip
        fields = [
            'id', 'trip_number', 'source', 'destination',
            'vehicle', 'driver', 'cargo_weight', 'planned_distance',
            'revenue', 'notes',
        ]
        read_only_fields = ['id', 'trip_number']

    def validate(self, attrs):
        vehicle = attrs.get('vehicle')
        driver = attrs.get('driver')
        cargo_weight = attrs.get('cargo_weight')

        errors = {}

        # === Vehicle Validations ===
        if vehicle:
            if vehicle.status == 'retired':
                errors['vehicle'] = 'Cannot assign a retired vehicle to a trip.'
            elif vehicle.status == 'in_shop':
                errors['vehicle'] = 'Cannot assign a vehicle that is in maintenance.'
            elif vehicle.status == 'on_trip':
                errors['vehicle'] = 'This vehicle is already on another trip.'

            # Cargo weight validation
            if cargo_weight and vehicle.max_load_capacity:
                if cargo_weight > vehicle.max_load_capacity:
                    errors['cargo_weight'] = (
                        f'Cargo weight ({cargo_weight} kg) exceeds vehicle '
                        f'max load capacity ({vehicle.max_load_capacity} kg).'
                    )

        # === Driver Validations ===
        if driver:
            if driver.status == 'suspended':
                errors['driver'] = 'Cannot assign a suspended driver to a trip.'
            elif driver.status == 'on_trip':
                errors['driver'] = 'This driver is already on another trip.'
            elif driver.status == 'off_duty':
                errors['driver'] = 'This driver is currently off duty.'

            if driver.is_license_expired:
                errors['driver'] = (
                    f'Driver\'s license expired on {driver.license_expiry_date}. '
                    f'Cannot assign to a trip.'
                )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def validate_cargo_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError('Cargo weight must be positive.')
        return value

    def validate_planned_distance(self, value):
        if value <= 0:
            raise serializers.ValidationError('Planned distance must be positive.')
        return value


class TripDispatchSerializer(serializers.Serializer):
    """Serializer for dispatching a trip."""

    start_odometer = serializers.FloatField(required=False, allow_null=True)

    def validate(self, attrs):
        trip = self.context.get('trip')
        if trip.status != 'draft':
            raise serializers.ValidationError(
                f'Only draft trips can be dispatched. Current status: {trip.status}.'
            )
        return attrs


class TripCompleteSerializer(serializers.Serializer):
    """Serializer for completing a trip."""

    end_odometer = serializers.FloatField(required=True)
    fuel_consumed = serializers.FloatField(required=True)
    actual_distance = serializers.FloatField(required=False, allow_null=True)
    revenue = serializers.FloatField(required=False, default=0)

    def validate_end_odometer(self, value):
        if value < 0:
            raise serializers.ValidationError('End odometer cannot be negative.')
        return value

    def validate_fuel_consumed(self, value):
        if value < 0:
            raise serializers.ValidationError('Fuel consumed cannot be negative.')
        return value

    def validate(self, attrs):
        trip = self.context.get('trip')
        if trip.status != 'dispatched':
            raise serializers.ValidationError(
                f'Only dispatched trips can be completed. Current status: {trip.status}.'
            )
        if trip.start_odometer and attrs.get('end_odometer'):
            if attrs['end_odometer'] < trip.start_odometer:
                raise serializers.ValidationError({
                    'end_odometer': 'End odometer cannot be less than start odometer.'
                })
        return attrs


class TripSerializer(serializers.ModelSerializer):
    """Full trip serializer with nested vehicle and driver info."""

    vehicle_detail = VehicleListSerializer(source='vehicle', read_only=True)
    driver_detail = DriverListSerializer(source='driver', read_only=True)
    fuel_efficiency = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id', 'trip_number', 'source', 'destination',
            'vehicle', 'driver', 'vehicle_detail', 'driver_detail',
            'cargo_weight', 'planned_distance', 'actual_distance',
            'status', 'start_odometer', 'end_odometer',
            'fuel_consumed', 'revenue', 'fuel_efficiency', 'notes',
            'dispatched_at', 'completed_at', 'cancelled_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'trip_number', 'status', 'dispatched_at',
            'completed_at', 'cancelled_at', 'created_at', 'updated_at',
        ]

    def get_fuel_efficiency(self, obj):
        """Calculate fuel efficiency: distance / fuel consumed."""
        distance = obj.actual_distance or obj.planned_distance
        if obj.fuel_consumed and obj.fuel_consumed > 0:
            return round(distance / obj.fuel_consumed, 2)
        return None


class TripListSerializer(serializers.ModelSerializer):
    """Lightweight trip serializer for list views."""

    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True)
    vehicle_reg = serializers.CharField(source='vehicle.registration_number', read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id', 'trip_number', 'source', 'destination',
            'vehicle_name', 'vehicle_reg', 'driver_name',
            'cargo_weight', 'status', 'created_at',
        ]
