from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsFleetManagerOrReadOnly
from .models import Vehicle
from .serializers import VehicleSerializer, VehicleListSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for vehicle CRUD operations.

    - Fleet Manager / Admin: full CRUD
    - Other authenticated roles: read-only
    """

    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated, IsFleetManagerOrReadOnly]
    filterset_fields = ['vehicle_type', 'status', 'region']
    search_fields = ['registration_number', 'name']
    ordering_fields = ['created_at', 'name', 'registration_number', 'status']

    def get_serializer_class(self):
        if self.action == 'list':
            return VehicleListSerializer
        return VehicleSerializer

    def destroy(self, request, *args, **kwargs):
        vehicle = self.get_object()
        if vehicle.status == 'on_trip':
            return Response(
                {'error': 'Cannot delete a vehicle that is currently on a trip.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='available')
    def available(self, request):
        """Return only vehicles that are available for dispatch."""
        vehicles = Vehicle.objects.filter(status='available')

        # Optional filters
        vehicle_type = request.query_params.get('vehicle_type')
        if vehicle_type:
            vehicles = vehicles.filter(vehicle_type=vehicle_type)

        min_capacity = request.query_params.get('min_capacity')
        if min_capacity:
            try:
                vehicles = vehicles.filter(max_load_capacity__gte=float(min_capacity))
            except ValueError:
                pass

        serializer = VehicleListSerializer(vehicles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='retire')
    def retire(self, request, pk=None):
        """Retire a vehicle (only if not on a trip)."""
        vehicle = self.get_object()
        if vehicle.status == 'on_trip':
            return Response(
                {'error': 'Cannot retire a vehicle that is currently on a trip.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        vehicle.status = 'retired'
        vehicle.save()
        return Response(VehicleSerializer(vehicle).data)
