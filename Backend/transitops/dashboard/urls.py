from django.urls import path
from . import views

urlpatterns = [
    path('kpis/', views.DashboardKPIView.as_view(), name='dashboard-kpis'),
]
