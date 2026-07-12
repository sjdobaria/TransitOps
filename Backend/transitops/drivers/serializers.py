from rest_framework import serializers
from django.utils import timezone
from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    """Full driver serializer for CRUD operations."""

    is_license_expired = serializers.ReadOnlyField()
    is_license_expiring_soon = serializers.ReadOnlyField()
    is_available_for_dispatch = serializers.ReadOnlyField()

    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'license_number', 'license_category',
            'license_expiry_date', 'contact_number', 'email',
            'safety_score', 'status', 'date_of_birth', 'hired_date',
            'notes', 'is_license_expired', 'is_license_expiring_soon',
            'is_available_for_dispatch', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_license_number(self, value):
        """Ensure license number is unique."""
        value = value.upper().strip()
        qs = Driver.objects.filter(license_number=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                'A driver with this license number already exists.'
            )
        return value

    def validate_safety_score(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError(
                'Safety score must be between 0 and 100.'
            )
        return value

    def validate_license_expiry_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                'Warning: This license has already expired.'
            )
        return value


class DriverListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views and dropdowns."""

    is_license_expired = serializers.ReadOnlyField()
    is_available_for_dispatch = serializers.ReadOnlyField()

    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'license_number', 'license_category',
            'license_expiry_date', 'safety_score', 'status',
            'is_license_expired', 'is_available_for_dispatch',
        ]
