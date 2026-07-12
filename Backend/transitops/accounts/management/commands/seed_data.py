"""
Management command to seed the database with sample data for testing.
Run with: python manage.py seed_data
"""

from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from maintenance.models import MaintenanceLog
from expenses.models import FuelLog, Expense

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with sample data for development and testing.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Expense.objects.all().delete()
            FuelLog.objects.all().delete()
            MaintenanceLog.objects.all().delete()
            Trip.objects.all().delete()
            Driver.objects.all().delete()
            Vehicle.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS('All data cleared.'))

        self._seed_users()
        self._seed_vehicles()
        self._seed_drivers()
        self._seed_trips()
        self._seed_maintenance()
        self._seed_fuel_logs()
        self._seed_expenses()

        self.stdout.write(self.style.SUCCESS('\n[SUCCESS] Database seeded successfully!'))

    def _seed_users(self):
        self.stdout.write('Seeding users...')
        users_data = [
            {
                'email': 'admin@transitops.com',
                'username': 'admin',
                'first_name': 'System',
                'last_name': 'Admin',
                'role': 'admin',
                'is_superuser': True,
                'is_staff': True,
            },
            {
                'email': 'fleet@transitops.com',
                'username': 'fleet_manager',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': 'fleet_manager',
            },
            {
                'email': 'dispatch@transitops.com',
                'username': 'dispatcher',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'role': 'dispatcher',
            },
            {
                'email': 'safety@transitops.com',
                'username': 'safety_officer',
                'first_name': 'Amit',
                'last_name': 'Kumar',
                'role': 'safety_officer',
            },
            {
                'email': 'finance@transitops.com',
                'username': 'financial_analyst',
                'first_name': 'Neha',
                'last_name': 'Gupta',
                'role': 'financial_analyst',
            },
        ]

        for user_data in users_data:
            if not User.objects.filter(email=user_data['email']).exists():
                user = User(**user_data)
                user.set_password('admin123')
                user.save()
                self.stdout.write(f'  Created user: {user.email} ({user.role})')
            else:
                user = User.objects.get(email=user_data['email'])
                user.set_password('admin123')
                user.save()
                self.stdout.write(f'  Updated password for user: {user.email}')

    def _seed_vehicles(self):
        self.stdout.write('Seeding vehicles...')
        vehicles_data = [
            {
                'registration_number': 'GJ-05-AB-1234',
                'name': 'Tata Ace',
                'vehicle_type': 'van',
                'max_load_capacity': 500,
                'current_odometer': 45000,
                'acquisition_cost': 600000,
                'status': 'available',
                'region': 'Gujarat',
                'acquisition_date': date(2023, 3, 15),
            },
            {
                'registration_number': 'MH-12-CD-5678',
                'name': 'Ashok Leyland Dost',
                'vehicle_type': 'truck',
                'max_load_capacity': 1500,
                'current_odometer': 78000,
                'acquisition_cost': 1200000,
                'status': 'available',
                'region': 'Maharashtra',
                'acquisition_date': date(2022, 7, 10),
            },
            {
                'registration_number': 'RJ-14-EF-9012',
                'name': 'Mahindra Bolero Pickup',
                'vehicle_type': 'truck',
                'max_load_capacity': 1250,
                'current_odometer': 62000,
                'acquisition_cost': 950000,
                'status': 'available',
                'region': 'Rajasthan',
                'acquisition_date': date(2023, 1, 20),
            },
            {
                'registration_number': 'DL-01-GH-3456',
                'name': 'Eicher Pro 2049',
                'vehicle_type': 'truck',
                'max_load_capacity': 5000,
                'current_odometer': 120000,
                'acquisition_cost': 2500000,
                'status': 'available',
                'region': 'Delhi NCR',
                'acquisition_date': date(2021, 11, 5),
            },
            {
                'registration_number': 'KA-03-IJ-7890',
                'name': 'Tata 407',
                'vehicle_type': 'truck',
                'max_load_capacity': 3500,
                'current_odometer': 95000,
                'acquisition_cost': 1800000,
                'status': 'available',
                'region': 'Karnataka',
                'acquisition_date': date(2022, 4, 18),
            },
            {
                'registration_number': 'GJ-01-KL-2345',
                'name': 'Maruti Suzuki Eeco Cargo',
                'vehicle_type': 'van',
                'max_load_capacity': 350,
                'current_odometer': 32000,
                'acquisition_cost': 450000,
                'status': 'available',
                'region': 'Gujarat',
                'acquisition_date': date(2024, 2, 1),
            },
            {
                'registration_number': 'TN-09-MN-6789',
                'name': 'BharatBenz 1217',
                'vehicle_type': 'truck',
                'max_load_capacity': 8000,
                'current_odometer': 150000,
                'acquisition_cost': 3200000,
                'status': 'retired',
                'region': 'Tamil Nadu',
                'acquisition_date': date(2019, 6, 22),
            },
            {
                'registration_number': 'UP-32-OP-1122',
                'name': 'Force Traveller',
                'vehicle_type': 'bus',
                'max_load_capacity': 2000,
                'current_odometer': 88000,
                'acquisition_cost': 1600000,
                'status': 'available',
                'region': 'Uttar Pradesh',
                'acquisition_date': date(2023, 9, 12),
            },
        ]

        for v_data in vehicles_data:
            if not Vehicle.objects.filter(
                registration_number=v_data['registration_number']
            ).exists():
                Vehicle.objects.create(**v_data)
                self.stdout.write(
                    f'  Created vehicle: {v_data["registration_number"]} - {v_data["name"]}'
                )

    def _seed_drivers(self):
        self.stdout.write('Seeding drivers...')
        today = date.today()
        drivers_data = [
            {
                'name': 'Alex Kumar',
                'license_number': 'DL-0420200012345',
                'license_category': 'C',
                'license_expiry_date': today + timedelta(days=365),
                'contact_number': '+91-9876543210',
                'email': 'alex.kumar@email.com',
                'safety_score': 95,
                'status': 'available',
                'hired_date': date(2022, 1, 15),
            },
            {
                'name': 'Rajesh Singh',
                'license_number': 'MH-1220210067890',
                'license_category': 'C',
                'license_expiry_date': today + timedelta(days=180),
                'contact_number': '+91-9876543211',
                'email': 'rajesh.singh@email.com',
                'safety_score': 88,
                'status': 'available',
                'hired_date': date(2021, 6, 20),
            },
            {
                'name': 'Suresh Patel',
                'license_number': 'GJ-0520220034567',
                'license_category': 'D',
                'license_expiry_date': today + timedelta(days=45),
                'contact_number': '+91-9876543212',
                'email': 'suresh.patel@email.com',
                'safety_score': 78,
                'status': 'available',
                'hired_date': date(2023, 3, 10),
            },
            {
                'name': 'Mohammed Iqbal',
                'license_number': 'RJ-1420200098765',
                'license_category': 'E',
                'license_expiry_date': today + timedelta(days=500),
                'contact_number': '+91-9876543213',
                'email': 'mohammed.iqbal@email.com',
                'safety_score': 92,
                'status': 'available',
                'hired_date': date(2020, 11, 1),
            },
            {
                'name': 'Vikram Yadav',
                'license_number': 'DL-0120230045678',
                'license_category': 'C',
                'license_expiry_date': today + timedelta(days=20),
                'contact_number': '+91-9876543214',
                'email': 'vikram.yadav@email.com',
                'safety_score': 65,
                'status': 'available',
                'hired_date': date(2023, 8, 5),
                'notes': 'License expiring soon — needs renewal',
            },
            {
                'name': 'Deepak Joshi',
                'license_number': 'KA-0320210056789',
                'license_category': 'B',
                'license_expiry_date': today - timedelta(days=30),
                'contact_number': '+91-9876543215',
                'email': 'deepak.joshi@email.com',
                'safety_score': 50,
                'status': 'suspended',
                'hired_date': date(2022, 5, 15),
                'notes': 'License expired, suspended until renewal',
            },
        ]

        for d_data in drivers_data:
            if not Driver.objects.filter(license_number=d_data['license_number']).exists():
                Driver.objects.create(**d_data)
                self.stdout.write(f'  Created driver: {d_data["name"]}')

    def _seed_trips(self):
        self.stdout.write('Seeding trips...')
        vehicles = list(Vehicle.objects.filter(status='available')[:3])
        drivers = list(Driver.objects.filter(status='available')[:3])

        if len(vehicles) < 2 or len(drivers) < 2:
            self.stdout.write('  Skipping trips — not enough vehicles/drivers')
            return

        # Create a completed trip
        trip1 = Trip.objects.create(
            source='Ahmedabad, Gujarat',
            destination='Mumbai, Maharashtra',
            vehicle=vehicles[0],
            driver=drivers[0],
            cargo_weight=400,
            planned_distance=530,
            actual_distance=545,
            status='completed',
            start_odometer=45000,
            end_odometer=45545,
            fuel_consumed=45,
            revenue=15000,
        )
        self.stdout.write(f'  Created completed trip: {trip1.trip_number}')

        # Create a draft trip
        trip2 = Trip.objects.create(
            source='Jaipur, Rajasthan',
            destination='Delhi, NCR',
            vehicle=vehicles[1],
            driver=drivers[1],
            cargo_weight=1200,
            planned_distance=280,
            status='draft',
            revenue=8000,
        )
        self.stdout.write(f'  Created draft trip: {trip2.trip_number}')

    def _seed_maintenance(self):
        self.stdout.write('Seeding maintenance logs...')
        vehicles = list(Vehicle.objects.all()[:3])

        if not vehicles:
            return

        MaintenanceLog.objects.create(
            vehicle=vehicles[0],
            maintenance_type='oil_change',
            description='Regular oil change at 45000 km',
            cost=3500,
            status='completed',
            scheduled_date=date.today() - timedelta(days=30),
            completed_date=date.today() - timedelta(days=28),
            mechanic_name='Raju Auto Works',
            service_center='Raju Auto Service Center, Ahmedabad',
        )
        self.stdout.write('  Created completed maintenance: Oil Change')

        MaintenanceLog.objects.create(
            vehicle=vehicles[1],
            maintenance_type='tire_replacement',
            description='Front tire replacement — worn out treads',
            cost=12000,
            status='completed',
            scheduled_date=date.today() - timedelta(days=15),
            completed_date=date.today() - timedelta(days=14),
            mechanic_name='Tyre King',
            service_center='Tyre King, Pune',
        )
        self.stdout.write('  Created completed maintenance: Tire Replacement')

    def _seed_fuel_logs(self):
        self.stdout.write('Seeding fuel logs...')
        vehicles = list(Vehicle.objects.all()[:3])

        if not vehicles:
            return

        fuel_data = [
            {'vehicle': vehicles[0], 'liters': 40, 'cost_per_liter': 105.50,
             'odometer_reading': 44800, 'date': date.today() - timedelta(days=10),
             'fuel_station': 'Indian Oil, SG Highway'},
            {'vehicle': vehicles[0], 'liters': 45, 'cost_per_liter': 106.20,
             'odometer_reading': 45200, 'date': date.today() - timedelta(days=3),
             'fuel_station': 'HP Petrol Pump, Ahmedabad'},
            {'vehicle': vehicles[1], 'liters': 60, 'cost_per_liter': 104.80,
             'odometer_reading': 77500, 'date': date.today() - timedelta(days=7),
             'fuel_station': 'Bharat Petroleum, Mumbai-Pune Expressway'},
        ]

        for fl in fuel_data:
            FuelLog.objects.create(**fl)
        self.stdout.write(f'  Created {len(fuel_data)} fuel logs')

    def _seed_expenses(self):
        self.stdout.write('Seeding expenses...')
        vehicles = list(Vehicle.objects.all()[:3])

        if not vehicles:
            return

        expenses_data = [
            {'vehicle': vehicles[0], 'expense_type': 'toll', 'amount': 1200,
             'date': date.today() - timedelta(days=5),
             'description': 'Ahmedabad-Mumbai highway toll'},
            {'vehicle': vehicles[0], 'expense_type': 'parking', 'amount': 500,
             'date': date.today() - timedelta(days=4),
             'description': 'Overnight parking at Mumbai depot'},
            {'vehicle': vehicles[1], 'expense_type': 'insurance', 'amount': 25000,
             'date': date.today() - timedelta(days=60),
             'description': 'Annual comprehensive insurance renewal'},
        ]

        for exp in expenses_data:
            Expense.objects.create(**exp)
        self.stdout.write(f'  Created {len(expenses_data)} expenses')
