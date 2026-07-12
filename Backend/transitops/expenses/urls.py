from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'fuel-logs', views.FuelLogViewSet, basename='fuel-log')
router.register(r'expenses', views.ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', include(router.urls)),
    path('vehicle-costs/', views.VehicleCostSummaryView.as_view(), name='vehicle-costs'),
]
