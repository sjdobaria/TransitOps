from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse

from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from maintenance.models import MaintenanceLog
from expenses.models import FuelLog, Expense
from .utils import generate_csv_response, generate_pdf_report


class FuelEfficiencyView(APIView):
    """
    Fuel Efficiency Report: Distance / Fuel consumed per vehicle.
    Aggregated from completed trips.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.all()
        report = []

        for vehicle in vehicles:
            completed_trips = Trip.objects.filter(
                vehicle=vehicle, status='completed'
            )

            total_distance = sum(
                t.actual_distance or t.planned_distance
                for t in completed_trips
            )
            total_fuel = sum(
                t.fuel_consumed or 0
                for t in completed_trips
            )

            efficiency = (
                round(total_distance / total_fuel, 2)
                if total_fuel > 0
                else None
            )

            report.append({
                'vehicle_id': str(vehicle.pk),
                'registration_number': vehicle.registration_number,
                'vehicle_name': vehicle.name,
                'total_distance_km': round(total_distance, 2),
                'total_fuel_liters': round(total_fuel, 2),
                'fuel_efficiency_km_per_liter': efficiency,
                'total_trips': completed_trips.count(),
            })

        # Sort by efficiency (best first, None last)
        report.sort(
            key=lambda x: x['fuel_efficiency_km_per_liter'] or 0,
            reverse=True,
        )

        return Response(report)


class FleetUtilizationView(APIView):
    """
    Fleet Utilization Report: percentage of time vehicles are on trips.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.exclude(status='retired')
        total = vehicles.count()
        on_trip = vehicles.filter(status='on_trip').count()
        in_shop = vehicles.filter(status='in_shop').count()
        available = vehicles.filter(status='available').count()

        utilization_pct = round((on_trip / total) * 100, 1) if total > 0 else 0

        # Per-vehicle utilization (based on completed trips)
        vehicle_stats = []
        for vehicle in vehicles:
            completed = Trip.objects.filter(
                vehicle=vehicle, status='completed'
            ).count()
            total_trips = Trip.objects.filter(vehicle=vehicle).count()

            vehicle_stats.append({
                'vehicle_id': str(vehicle.pk),
                'registration_number': vehicle.registration_number,
                'vehicle_name': vehicle.name,
                'status': vehicle.status,
                'completed_trips': completed,
                'total_trips': total_trips,
            })

        return Response({
            'summary': {
                'total_active_vehicles': total,
                'on_trip': on_trip,
                'in_shop': in_shop,
                'available': available,
                'utilization_percent': utilization_pct,
            },
            'vehicles': vehicle_stats,
        })


class OperationalCostView(APIView):
    """
    Operational Cost Report: breakdown by fuel, maintenance, and other expenses.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicle_id = request.query_params.get('vehicle_id')

        vehicles = Vehicle.objects.all()
        if vehicle_id:
            vehicles = vehicles.filter(pk=vehicle_id)

        report = []
        grand_fuel = 0
        grand_maintenance = 0
        grand_other = 0

        for vehicle in vehicles:
            fuel_cost = sum(
                fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle)
            )
            maint_cost = sum(
                ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle)
            )
            other_cost = sum(
                e.amount for e in Expense.objects.filter(vehicle=vehicle)
            )
            total = fuel_cost + maint_cost + other_cost

            grand_fuel += fuel_cost
            grand_maintenance += maint_cost
            grand_other += other_cost

            report.append({
                'vehicle_id': str(vehicle.pk),
                'registration_number': vehicle.registration_number,
                'vehicle_name': vehicle.name,
                'fuel_cost': round(fuel_cost, 2),
                'maintenance_cost': round(maint_cost, 2),
                'other_expenses': round(other_cost, 2),
                'total_cost': round(total, 2),
            })

        return Response({
            'grand_totals': {
                'fuel': round(grand_fuel, 2),
                'maintenance': round(grand_maintenance, 2),
                'other': round(grand_other, 2),
                'total': round(grand_fuel + grand_maintenance + grand_other, 2),
            },
            'vehicles': report,
        })


class VehicleROIView(APIView):
    """
    Vehicle ROI Report:
    ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.all()
        report = []

        for vehicle in vehicles:
            # Revenue from completed trips
            revenue = sum(
                t.revenue or 0
                for t in Trip.objects.filter(vehicle=vehicle, status='completed')
            )

            # Costs
            fuel_cost = sum(
                fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle)
            )
            maint_cost = sum(
                ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle)
            )
            total_cost = fuel_cost + maint_cost

            # ROI calculation
            acquisition = vehicle.acquisition_cost
            roi = (
                round((revenue - total_cost) / acquisition, 4)
                if acquisition > 0
                else None
            )

            profit = revenue - total_cost

            report.append({
                'vehicle_id': str(vehicle.pk),
                'registration_number': vehicle.registration_number,
                'vehicle_name': vehicle.name,
                'acquisition_cost': acquisition,
                'total_revenue': round(revenue, 2),
                'total_fuel_cost': round(fuel_cost, 2),
                'total_maintenance_cost': round(maint_cost, 2),
                'total_cost': round(total_cost, 2),
                'profit': round(profit, 2),
                'roi': roi,
                'roi_percent': round(roi * 100, 2) if roi is not None else None,
            })

        report.sort(key=lambda x: x['roi'] or -999, reverse=True)

        return Response(report)


class CSVExportView(APIView):
    """
    Export reports as CSV.
    Query param: report_type = fuel_efficiency | operational_costs | vehicle_roi | fleet_utilization
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        report_type = request.query_params.get('report_type', 'fuel_efficiency')

        if report_type == 'fuel_efficiency':
            return self._export_fuel_efficiency()
        elif report_type == 'operational_costs':
            return self._export_operational_costs()
        elif report_type == 'vehicle_roi':
            return self._export_vehicle_roi()
        elif report_type == 'fleet_utilization':
            return self._export_fleet_utilization()
        else:
            return Response(
                {'error': f'Unknown report type: {report_type}'},
                status=400,
            )

    def _export_fuel_efficiency(self):
        headers = [
            'Registration Number', 'Vehicle Name', 'Total Distance (km)',
            'Total Fuel (L)', 'Efficiency (km/L)', 'Total Trips',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            trips = Trip.objects.filter(vehicle=vehicle, status='completed')
            total_distance = sum(t.actual_distance or t.planned_distance for t in trips)
            total_fuel = sum(t.fuel_consumed or 0 for t in trips)
            efficiency = round(total_distance / total_fuel, 2) if total_fuel > 0 else 'N/A'
            data.append([
                vehicle.registration_number, vehicle.name,
                round(total_distance, 2), round(total_fuel, 2),
                efficiency, trips.count(),
            ])

        csv_content = generate_csv_response(data, headers, 'fuel_efficiency.csv')
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="fuel_efficiency_report.csv"'
        return response

    def _export_operational_costs(self):
        headers = [
            'Registration Number', 'Vehicle Name', 'Fuel Cost',
            'Maintenance Cost', 'Other Expenses', 'Total Cost',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            fuel = sum(fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle))
            maint = sum(ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle))
            other = sum(e.amount for e in Expense.objects.filter(vehicle=vehicle))
            data.append([
                vehicle.registration_number, vehicle.name,
                round(fuel, 2), round(maint, 2), round(other, 2),
                round(fuel + maint + other, 2),
            ])

        csv_content = generate_csv_response(data, headers, 'operational_costs.csv')
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="operational_costs_report.csv"'
        return response

    def _export_vehicle_roi(self):
        headers = [
            'Registration Number', 'Vehicle Name', 'Acquisition Cost',
            'Revenue', 'Total Cost', 'Profit', 'ROI (%)',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            revenue = sum(
                t.revenue or 0
                for t in Trip.objects.filter(vehicle=vehicle, status='completed')
            )
            fuel = sum(fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle))
            maint = sum(ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle))
            total_cost = fuel + maint
            profit = revenue - total_cost
            roi = (
                round((profit / vehicle.acquisition_cost) * 100, 2)
                if vehicle.acquisition_cost > 0
                else 'N/A'
            )
            data.append([
                vehicle.registration_number, vehicle.name,
                vehicle.acquisition_cost, round(revenue, 2),
                round(total_cost, 2), round(profit, 2), roi,
            ])

        csv_content = generate_csv_response(data, headers, 'vehicle_roi.csv')
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="vehicle_roi_report.csv"'
        return response

    def _export_fleet_utilization(self):
        headers = [
            'Registration Number', 'Vehicle Name', 'Status',
            'Completed Trips', 'Total Trips',
        ]
        data = []
        for vehicle in Vehicle.objects.exclude(status='retired'):
            completed = Trip.objects.filter(vehicle=vehicle, status='completed').count()
            total = Trip.objects.filter(vehicle=vehicle).count()
            data.append([
                vehicle.registration_number, vehicle.name,
                vehicle.status, completed, total,
            ])

        csv_content = generate_csv_response(data, headers, 'fleet_utilization.csv')
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="fleet_utilization_report.csv"'
        return response


class PDFExportView(APIView):
    """
    Export reports as PDF.
    Query param: report_type = fuel_efficiency | operational_costs | vehicle_roi
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        report_type = request.query_params.get('report_type', 'fuel_efficiency')

        if report_type == 'fuel_efficiency':
            return self._export_fuel_efficiency_pdf()
        elif report_type == 'operational_costs':
            return self._export_operational_costs_pdf()
        elif report_type == 'vehicle_roi':
            return self._export_vehicle_roi_pdf()
        else:
            return Response({'error': f'Unknown report type: {report_type}'}, status=400)

    def _export_fuel_efficiency_pdf(self):
        headers = [
            'Reg. No.', 'Vehicle', 'Distance (km)',
            'Fuel (L)', 'Efficiency', 'Trips',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            trips = Trip.objects.filter(vehicle=vehicle, status='completed')
            total_distance = sum(t.actual_distance or t.planned_distance for t in trips)
            total_fuel = sum(t.fuel_consumed or 0 for t in trips)
            efficiency = f"{round(total_distance / total_fuel, 2)} km/L" if total_fuel > 0 else 'N/A'
            data.append([
                vehicle.registration_number, vehicle.name,
                round(total_distance, 2), round(total_fuel, 2),
                efficiency, str(trips.count()),
            ])

        buffer = generate_pdf_report(
            'Fuel Efficiency Report', headers, data, 'fuel_efficiency'
        )
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="fuel_efficiency_report.pdf"'
        return response

    def _export_operational_costs_pdf(self):
        headers = [
            'Reg. No.', 'Vehicle', 'Fuel Cost',
            'Maintenance', 'Other', 'Total',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            fuel = sum(fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle))
            maint = sum(ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle))
            other = sum(e.amount for e in Expense.objects.filter(vehicle=vehicle))
            data.append([
                vehicle.registration_number, vehicle.name,
                str(round(fuel, 2)), str(round(maint, 2)),
                str(round(other, 2)), str(round(fuel + maint + other, 2)),
            ])

        buffer = generate_pdf_report(
            'Operational Costs Report', headers, data, 'operational_costs'
        )
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="operational_costs_report.pdf"'
        return response

    def _export_vehicle_roi_pdf(self):
        headers = [
            'Reg. No.', 'Vehicle', 'Acq. Cost',
            'Revenue', 'Total Cost', 'Profit', 'ROI %',
        ]
        data = []
        for vehicle in Vehicle.objects.all():
            revenue = sum(
                t.revenue or 0
                for t in Trip.objects.filter(vehicle=vehicle, status='completed')
            )
            fuel = sum(fl.total_cost for fl in FuelLog.objects.filter(vehicle=vehicle))
            maint = sum(ml.cost for ml in MaintenanceLog.objects.filter(vehicle=vehicle))
            total_cost = fuel + maint
            profit = revenue - total_cost
            roi = (
                f"{round((profit / vehicle.acquisition_cost) * 100, 2)}%"
                if vehicle.acquisition_cost > 0
                else 'N/A'
            )
            data.append([
                vehicle.registration_number, vehicle.name,
                str(vehicle.acquisition_cost), str(round(revenue, 2)),
                str(round(total_cost, 2)), str(round(profit, 2)), roi,
            ])

        buffer = generate_pdf_report(
            'Vehicle ROI Report', headers, data, 'vehicle_roi'
        )
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="vehicle_roi_report.pdf"'
        return response
