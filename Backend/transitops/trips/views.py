from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from accounts.permissions import IsDispatcherOrFleetManager
from .models import Trip
from .serializers import (
    TripSerializer,
    TripListSerializer,
    TripCreateSerializer,
    TripDispatchSerializer,
    TripCompleteSerializer,
)


class TripViewSet(viewsets.ModelViewSet):
    """
    ViewSet for trip management with full lifecycle support.

    Business rules enforced:
    - Cargo weight must not exceed vehicle max load capacity
    - Retired/In Shop vehicles cannot be dispatched
    - Suspended/expired-license drivers cannot be assigned
    - Vehicle/driver already On Trip cannot be re-assigned
    - Dispatch: Draft → Dispatched (sets vehicle+driver to On Trip)
    - Complete: Dispatched → Completed (restores vehicle+driver to Available)
    - Cancel: Dispatched → Cancelled (restores vehicle+driver to Available)
    """

    queryset = Trip.objects.select_related('vehicle', 'driver').all()
    permission_classes = [IsAuthenticated, IsDispatcherOrFleetManager]
    filterset_fields = ['status', 'vehicle', 'driver']
    search_fields = ['trip_number', 'source', 'destination']
    ordering_fields = ['created_at', 'trip_number', 'status']

    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    def perform_create(self, serializer):
        """Create a trip in Draft status."""
        serializer.save(status='draft')

    @action(detail=True, methods=['post'], url_path='dispatch')
    def dispatch_trip(self, request, pk=None):
        """
        Dispatch a draft trip.
        - Changes trip status: Draft → Dispatched
        - Changes vehicle status to On Trip
        - Changes driver status to On Trip
        """
        trip = self.get_object()
        serializer = TripDispatchSerializer(
            data=request.data, context={'trip': trip}
        )
        serializer.is_valid(raise_exception=True)

        # Re-validate vehicle and driver availability at dispatch time
        vehicle = trip.vehicle
        driver = trip.driver

        if vehicle.status != 'available':
            return Response(
                {'error': f'Vehicle is no longer available. Current status: {vehicle.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if driver.status != 'available':
            return Response(
                {'error': f'Driver is no longer available. Current status: {driver.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if driver.is_license_expired:
            return Response(
                {'error': f'Driver\'s license has expired ({driver.license_expiry_date}).'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Perform the dispatch
        trip.status = 'dispatched'
        trip.dispatched_at = timezone.now()
        if serializer.validated_data.get('start_odometer'):
            trip.start_odometer = serializer.validated_data['start_odometer']
        else:
            trip.start_odometer = vehicle.current_odometer
        trip.save()

        # Update vehicle and driver status
        vehicle.status = 'on_trip'
        vehicle.save()

        driver.status = 'on_trip'
        driver.save()

        return Response(
            {
                'message': f'Trip {trip.trip_number} dispatched successfully.',
                'trip': TripSerializer(trip).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_trip(self, request, pk=None):
        """
        Complete a dispatched trip.
        - Changes trip status: Dispatched → Completed
        - Restores vehicle and driver to Available
        - Updates vehicle odometer
        """
        trip = self.get_object()
        serializer = TripCompleteSerializer(
            data=request.data, context={'trip': trip}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        # Update trip
        trip.status = 'completed'
        trip.completed_at = timezone.now()
        trip.end_odometer = data['end_odometer']
        trip.fuel_consumed = data['fuel_consumed']

        if data.get('actual_distance'):
            trip.actual_distance = data['actual_distance']
        elif trip.start_odometer:
            trip.actual_distance = data['end_odometer'] - trip.start_odometer

        if data.get('revenue'):
            trip.revenue = data['revenue']

        trip.save()

        # Update vehicle odometer and restore status
        vehicle = trip.vehicle
        vehicle.current_odometer = data['end_odometer']
        vehicle.status = 'available'
        vehicle.save()

        # Restore driver status
        driver = trip.driver
        driver.status = 'available'
        driver.save()

        return Response(
            {
                'message': f'Trip {trip.trip_number} completed successfully.',
                'trip': TripSerializer(trip).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_trip(self, request, pk=None):
        """
        Cancel a dispatched trip.
        - Changes trip status: Dispatched → Cancelled
        - Restores vehicle and driver to Available
        """
        trip = self.get_object()

        if trip.status == 'completed':
            return Response(
                {'error': 'Cannot cancel a completed trip.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if trip.status == 'cancelled':
            return Response(
                {'error': 'Trip is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If trip was dispatched, restore vehicle and driver
        if trip.status == 'dispatched':
            vehicle = trip.vehicle
            vehicle.status = 'available'
            vehicle.save()

            driver = trip.driver
            driver.status = 'available'
            driver.save()

        trip.status = 'cancelled'
        trip.cancelled_at = timezone.now()
        trip.save()

        return Response(
            {
                'message': f'Trip {trip.trip_number} cancelled.',
                'trip': TripSerializer(trip).data,
            },
            status=status.HTTP_200_OK,
        )
