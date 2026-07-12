from rest_framework import serializers
from .models import FuelLog, Expense


class FuelLogSerializer(serializers.ModelSerializer):
    """Serializer for fuel log CRUD."""

    vehicle_reg = serializers.CharField(
        source='vehicle.registration_number', read_only=True
    )

    class Meta:
        model = FuelLog
        fields = [
            'id', 'vehicle', 'vehicle_reg', 'trip', 'liters',
            'cost_per_liter', 'total_cost', 'odometer_reading',
            'date', 'fuel_station', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'total_cost', 'created_at', 'updated_at']

    def validate_liters(self, value):
        if value <= 0:
            raise serializers.ValidationError('Liters must be positive.')
        return value

    def validate_cost_per_liter(self, value):
        if value <= 0:
            raise serializers.ValidationError('Cost per liter must be positive.')
        return value


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for expense CRUD."""

    vehicle_reg = serializers.CharField(
        source='vehicle.registration_number', read_only=True, default=None
    )

    class Meta:
        model = Expense
        fields = [
            'id', 'vehicle', 'vehicle_reg', 'trip', 'expense_type',
            'amount', 'date', 'description', 'receipt_number',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be positive.')
        return value


class VehicleCostSummarySerializer(serializers.Serializer):
    """Serializer for vehicle cost summary response."""

    vehicle_id = serializers.CharField()
    registration_number = serializers.CharField()
    vehicle_name = serializers.CharField()
    total_fuel_cost = serializers.FloatField()
    total_maintenance_cost = serializers.FloatField()
    total_other_expenses = serializers.FloatField()
    total_operational_cost = serializers.FloatField()
