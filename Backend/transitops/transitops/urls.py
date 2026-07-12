"""
URL configuration for transitops project.

All API routes are prefixed with /api/
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication & User Management
    path('api/auth/', include('accounts.urls')),

    # Core Resources
    path('api/vehicles/', include('vehicles.urls')),
    path('api/drivers/', include('drivers.urls')),
    path('api/trips/', include('trips.urls')),
    path('api/maintenance/', include('maintenance.urls')),

    # Financial
    path('api/', include('expenses.urls')),

    # Dashboard & Analytics
    path('api/dashboard/', include('dashboard.urls')),
    path('api/analytics/', include('analytics.urls')),
]
