from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from django.utils import timezone


class DashboardKPIView(APIView):
    """
    Returns key performance indicators for the dashboard.

    KPIs:
    - Active Vehicles, Available Vehicles, Vehicles In Maintenance, Retired Vehicles
    - Active Trips, Pending (Draft) Trips, Completed Trips
    - Drivers On Duty, Available Drivers, Suspended Drivers
    - Fleet Utilization (%) = (On Trip vehicles / total non-retired) × 100

    Supports optional filters via query params: vehicle_type, status, region
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Optional filters
        vehicle_type = request.query_params.get('vehicle_type')
        region = request.query_params.get('region')

        # Vehicle KPIs
        vehicles_qs = Vehicle.objects.all()
        if vehicle_type:
            vehicles_qs = vehicles_qs.filter(vehicle_type=vehicle_type)
        if region:
            vehicles_qs = vehicles_qs.filter(region=region)

        total_vehicles = vehicles_qs.count()
        available_vehicles = vehicles_qs.filter(status='available').count()
        on_trip_vehicles = vehicles_qs.filter(status='on_trip').count()
        in_shop_vehicles = vehicles_qs.filter(status='in_shop').count()
        retired_vehicles = vehicles_qs.filter(status='retired').count()

        # Fleet utilization
        non_retired = total_vehicles - retired_vehicles
        fleet_utilization = (
            round((on_trip_vehicles / non_retired) * 100, 1)
            if non_retired > 0
            else 0
        )

        # Driver KPIs
        total_drivers = Driver.objects.count()
        available_drivers = Driver.objects.filter(status='available').count()
        on_duty_drivers = Driver.objects.filter(status='on_trip').count()
        off_duty_drivers = Driver.objects.filter(status='off_duty').count()
        suspended_drivers = Driver.objects.filter(status='suspended').count()

        # License expiry warning
        today = timezone.now().date()
        from datetime import timedelta
        expiring_soon = Driver.objects.filter(
            license_expiry_date__gte=today,
            license_expiry_date__lte=today + timedelta(days=30),
        ).count()
        expired_licenses = Driver.objects.filter(
            license_expiry_date__lt=today,
        ).count()

        # Trip KPIs
        total_trips = Trip.objects.count()
        draft_trips = Trip.objects.filter(status='draft').count()
        dispatched_trips = Trip.objects.filter(status='dispatched').count()
        completed_trips = Trip.objects.filter(status='completed').count()
        cancelled_trips = Trip.objects.filter(status='cancelled').count()

        return Response({
            'vehicles': {
                'total': total_vehicles,
                'available': available_vehicles,
                'on_trip': on_trip_vehicles,
                'in_shop': in_shop_vehicles,
                'retired': retired_vehicles,
            },
            'fleet_utilization_percent': fleet_utilization,
            'drivers': {
                'total': total_drivers,
                'available': available_drivers,
                'on_duty': on_duty_drivers,
                'off_duty': off_duty_drivers,
                'suspended': suspended_drivers,
                'expiring_licenses': expiring_soon,
                'expired_licenses': expired_licenses,
            },
            'trips': {
                'total': total_trips,
                'draft': draft_trips,
                'dispatched': dispatched_trips,
                'completed': completed_trips,
                'cancelled': cancelled_trips,
            },
        })
