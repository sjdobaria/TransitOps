from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta

from accounts.permissions import IsFleetManagerOrReadOnly, IsSafetyOfficer
from .models import Driver
from .serializers import DriverSerializer, DriverListSerializer


class DriverViewSet(viewsets.ModelViewSet):
    """
    ViewSet for driver CRUD operations.

    - Fleet Manager / Admin: full CRUD
    - Other authenticated roles: read-only
    """

    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated, IsFleetManagerOrReadOnly]
    filterset_fields = ['status', 'license_category']
    search_fields = ['name', 'license_number', 'contact_number']
    ordering_fields = ['created_at', 'name', 'safety_score', 'license_expiry_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return DriverListSerializer
        return DriverSerializer

    def destroy(self, request, *args, **kwargs):
        driver = self.get_object()
        if driver.status == 'on_trip':
            return Response(
                {'error': 'Cannot delete a driver who is currently on a trip.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='available')
    def available(self, request):
        """Return only drivers available for dispatch (valid license, available status)."""
        today = timezone.now().date()
        drivers = Driver.objects.filter(
            status='available',
            license_expiry_date__gte=today,
        )

        license_category = request.query_params.get('license_category')
        if license_category:
            drivers = drivers.filter(license_category=license_category)

        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='expiring-licenses')
    def expiring_licenses(self, request):
        """Return drivers whose licenses expire within the next 30 days."""
        today = timezone.now().date()
        threshold = today + timedelta(days=30)
        drivers = Driver.objects.filter(
            license_expiry_date__gte=today,
            license_expiry_date__lte=threshold,
        )
        serializer = DriverListSerializer(drivers, many=True)
        return Response({
            'count': drivers.count(),
            'drivers': serializer.data,
        })

    @action(detail=True, methods=['post'], url_path='suspend')
    def suspend(self, request, pk=None):
        """Suspend a driver (only if not on a trip)."""
        driver = self.get_object()
        if driver.status == 'on_trip':
            return Response(
                {'error': 'Cannot suspend a driver who is currently on a trip.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        driver.status = 'suspended'
        driver.save()
        return Response(DriverSerializer(driver).data)

    @action(detail=True, methods=['post'], url_path='reinstate')
    def reinstate(self, request, pk=None):
        """Reinstate a suspended driver to available status."""
        driver = self.get_object()
        if driver.status != 'suspended':
            return Response(
                {'error': 'Only suspended drivers can be reinstated.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        driver.status = 'available'
        driver.save()
        return Response(DriverSerializer(driver).data)
