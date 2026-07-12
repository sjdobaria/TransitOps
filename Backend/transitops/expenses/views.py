from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsFleetManagerOrReadOnly
from vehicles.models import Vehicle
from maintenance.models import MaintenanceLog
from .models import FuelLog, Expense
from .serializers import FuelLogSerializer, ExpenseSerializer


class FuelLogViewSet(viewsets.ModelViewSet):
    """ViewSet for fuel log CRUD."""

    queryset = FuelLog.objects.select_related('vehicle', 'trip').all()
    serializer_class = FuelLogSerializer
    permission_classes = [IsAuthenticated, IsFleetManagerOrReadOnly]
    filterset_fields = ['vehicle', 'trip']
    search_fields = ['vehicle__registration_number', 'fuel_station']
    ordering_fields = ['date', 'created_at', 'total_cost']


class ExpenseViewSet(viewsets.ModelViewSet):
    """ViewSet for expense CRUD."""

    queryset = Expense.objects.select_related('vehicle', 'trip').all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsFleetManagerOrReadOnly]
    filterset_fields = ['vehicle', 'trip', 'expense_type']
    search_fields = ['vehicle__registration_number', 'description', 'receipt_number']
    ordering_fields = ['date', 'created_at', 'amount']


class VehicleCostSummaryView(APIView):
    """
    Returns total operational cost (Fuel + Maintenance + Other) per vehicle.
    Automatically computes from FuelLog, MaintenanceLog, and Expense records.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicle_id = request.query_params.get('vehicle_id')

        if vehicle_id:
            vehicles = Vehicle.objects.filter(pk=vehicle_id)
        else:
            vehicles = Vehicle.objects.all()

        results = []
        for vehicle in vehicles:
            fuel_cost = sum(
                fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle)
            )
            maintenance_cost = sum(
                ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle)
            )
            other_expenses = sum(
                e.amount for e in Expense.objects.filter(vehicle=vehicle)
            )
            total = fuel_cost + maintenance_cost + other_expenses

            results.append({
                'vehicle_id': str(vehicle.pk),
                'registration_number': vehicle.registration_number,
                'vehicle_name': vehicle.name,
                'total_fuel_cost': round(fuel_cost, 2),
                'total_maintenance_cost': round(maintenance_cost, 2),
                'total_other_expenses': round(other_expenses, 2),
                'total_operational_cost': round(total, 2),
            })

        return Response(results)
