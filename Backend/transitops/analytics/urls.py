from django.urls import path
from . import views

urlpatterns = [
    path('fuel-efficiency/', views.FuelEfficiencyView.as_view(), name='fuel-efficiency'),
    path('fleet-utilization/', views.FleetUtilizationView.as_view(), name='fleet-utilization'),
    path('operational-costs/', views.OperationalCostView.as_view(), name='operational-costs'),
    path('vehicle-roi/', views.VehicleROIView.as_view(), name='vehicle-roi'),
    path('export/csv/', views.CSVExportView.as_view(), name='csv-export'),
    path('export/pdf/', views.PDFExportView.as_view(), name='pdf-export'),
]
