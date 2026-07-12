from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from accounts.permissions import IsFleetManagerOrReadOnly
from .models import MaintenanceLog
from .serializers import (
    MaintenanceLogSerializer,
    MaintenanceListSerializer,
    MaintenanceCloseSerializer,
)


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for maintenance log management.

    Business rules:
    - Creating a maintenance record automatically sets vehicle status to "In Shop"
    - Closing maintenance restores vehicle to "Available" (unless retired)
    """

    queryset = MaintenanceLog.objects.select_related('vehicle').all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated, IsFleetManagerOrReadOnly]
    filterset_fields = ['vehicle', 'status', 'maintenance_type']
    search_fields = ['vehicle__registration_number', 'description', 'mechanic_name']
    ordering_fields = ['created_at', 'cost', 'scheduled_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return MaintenanceListSerializer
        return MaintenanceLogSerializer

    def perform_create(self, serializer):
        """
        On creating a maintenance record:
        - Set vehicle status to 'in_shop'
        - Remove it from the dispatch pool
        """
        maintenance = serializer.save()
        vehicle = maintenance.vehicle
        if vehicle.status != 'retired':
            vehicle.status = 'in_shop'
            vehicle.save()

    @action(detail=True, methods=['post'], url_path='close')
    def close_maintenance(self, request, pk=None):
        """
        Close a maintenance record.
        - Sets maintenance status to 'completed'
        - Sets completed_date
        - Restores vehicle to 'available' (unless retired)
        """
        maintenance = self.get_object()

        if maintenance.status == 'completed':
            return Response(
                {'error': 'This maintenance record is already completed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MaintenanceCloseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Update maintenance record
        maintenance.status = 'completed'
        maintenance.completed_date = data.get('completed_date', timezone.now().date())
        if 'cost' in data:
            maintenance.cost = data['cost']
        if 'notes' in data:
            maintenance.notes = data['notes']
        maintenance.save()

        # Restore vehicle status
        vehicle = maintenance.vehicle
        # Only restore if no other open/in-progress maintenance exists
        active_maintenance = MaintenanceLog.objects.filter(
            vehicle=vehicle,
            status__in=['open', 'in_progress'],
        ).exclude(pk=maintenance.pk).exists()

        if not active_maintenance and vehicle.status != 'retired':
            vehicle.status = 'available'
            vehicle.save()

        return Response(
            {
                'message': f'Maintenance for {vehicle.registration_number} completed.',
                'maintenance': MaintenanceLogSerializer(maintenance).data,
            },
            status=status.HTTP_200_OK,
        )
