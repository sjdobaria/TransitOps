# TransitOps — Enterprise Fleet & Dispatch Command Center

<div align="center">

![TransitOps Banner](https://img.shields.io/badge/TransitOps-Enterprise%20Fleet%20OS-10b981?style=for-the-badge&logo=truck&logoColor=white)
![Django](https://img.shields.io/badge/Django%206.0-092E20?style=for-the-badge&logo=django&logoColor=green)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite%208.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-REST%20API-ff1709?style=for-the-badge&logo=django&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Analytics-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

**Precision fleet dispatch, automated cost ledger synchronization, and real-time MongoDB transport operations command center.**

[Features](#features) • [Tech Stack](#tech-stack) • [Setup Instructions](#setup-instructions) • [Running the Project](#running-the-project) • [Team](#team-members)

</div>
---

## 📌 What is TransitOps?

**TransitOps** is an enterprise-grade, full-stack fleet management, dispatch coordination, and logistics operations platform. Designed for modern transport operators, fleet managers, safety compliance officers, and financial analysts, TransitOps provides a centralized command tower to monitor vehicle telemetry, orchestrate live dispatches, track maintenance schedules, and maintain a 100% automated, real-time cost ledger powered by *MongoDB Atlas*.

Whether managing dozens of urban delivery vans or hundreds of interstate freight trucks, TransitOps eliminates data silos between drivers, mechanics, dispatchers, and accountants by ensuring every trip, fuel receipt, and maintenance log is synced instantly across the organization.

---

<a id="features"></a>
## ⚡ Key Features

### 🔐 1. Role-Based Access Control (RBAC) & Enterprise Workspaces
TransitOps tailors the interface, navigation, and operational metrics based on the user's specific role:
- 🚚 **Fleet Manager**: Full dispatch oversight, asset utilization tracking, driver assignments, and master operational command.
- 🛣️ **Driver**: Route tracking, instant trip logging, live status updates, and vehicle telemetry access.
- 🛡️ **Safety Officer**: Compliance pulse monitoring, vehicle inspection tracking, driver license status auditing (`ACTIVE`, `EXPIRED`, `SUSPENDED`), and incident logging.
- 💼 **Financial Analyst**: Dedicated cost ledger access, automated fuel & miscellaneous expense calculations, efficiency auditing, and financial reporting.

### 🗺️ 2. Live Dispatch & Trip Management
- Create, assign, and track trips across comprehensive operational stages (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- Automatic validation of driver and vehicle assignments (`driver_id` and `vehicle_id` mapping) to ensure zero data discrepancies.
- Real-time trip status filtering and search capabilities.

### 💰 3. Synchronized Cost Ledger & Expense Management
- **100% Automated Financial Sync**: Log fuel expenses (`liters`, `cost_per_liter`, `fuel_cost`) and miscellaneous operational expenditures (`miscellaneous_expense`).
- Automatic database-level computation of total trip expenses ($Total Cost = Fuel Cost + Miscellaneous Expense$).
- Instant synchronization across all KPI cards, chart models, and financial reports.

### 🛠️ 4. Proactive Maintenance & Asset Health Pulse
- Log and monitor service requests across full lifecycles (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`).
- Track vehicle health statuses (`ACTIVE`, `MAINTENANCE`, `INACTIVE`) to prevent unplanned breakdown downtime.
- Associate maintenance logs directly with specific fleet assets (`vehicle_registration`).

### 📊 5. Interactive Recharts Visualizations & KPI Dashboard
- Dynamic, responsive **Recharts** integrations featuring multi-metric area charts, fuel cost breakdowns, and trip completion analytics.
- Real-time KPI summary scorecards (Total Active Fleet, Dispatch Accuracy, Maintenance Load, Total Operational Costs).

### 🎨 6. Modern Dual-Theme Glassmorphism UI
- Built with curated, harmonious color palettes featuring deep slate/emerald dark modes and crisp light modes.
- Instant, flicker-free theme switching (`ThemeContext`) with persistent state storage.
- Responsive mobile control drawer and clean layout ergonomics (`DashboardLayout`).

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

### **Frontend Architecture**
| Technology | Description |
| :--- | :--- |
| **React 18 & Vite 8** | High-performance SPA framework with ultra-fast Hot Module Replacement (HMR). |
| **Tailwind CSS** | Utility-first styling with custom glassmorphism design tokens and rich animations. |
| **Lucide React** | Modern, clean iconography tailored for logistics and enterprise dashboards. |
| **Recharts** | Composable, responsive charting library for real-time operational analytics. |
| **React Router DOM v7** | Seamless client-side navigation with protected route boundaries. |
| **Axios & Context API** | Centralized HTTP client (`api.js`) with automatic JWT token refresh (`ensureValidBackendToken`) and global state orchestration (`OperationsContext`). |

### **Backend Architecture**
| Technology | Description |
| :--- | :--- |
| **Python 3 / Django 6.0** | Robust, enterprise-ready web framework handling business logic and API routing. |
| **Django REST Framework (DRF)** | Powerful RESTful serialization and endpoint architecture (`djangorestframework`). |
| **MongoDB Atlas / PyMongo** | Document-oriented NoSQL database integrated natively via `django-mongodb-backend` (Django 6 official MongoDB backend). |
| **DRF SimpleJWT** | Secure JSON Web Token authentication handling access and refresh token rotation. |
| **Django CORS Headers** | Cross-Origin Resource Sharing management allowing secure communication between Vite (`:5173`) and Django (`:8000`). |

---

<a id="setup-instructions"></a>
## ⚙️ Setup Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18.0 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- **MongoDB Atlas** account (or local MongoDB instance running on port `27017`)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/sjdobaria/TransitOps.git
cd TransitOps
```

### 2. Database Configuration
Ensure your MongoDB instance is running. If connecting to **MongoDB Atlas**, update your database settings in `Backend/transitops/transitops/settings.py` or create a `.env` file in the backend root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/transitops_db?retryWrites=true&w=majority
```

---

<a id="running-the-project"></a>
## 🚀 How to Run the Backend & Frontend

To run the full-stack application locally, open **two terminal windows** (or split your IDE terminal).

### 🖥️ Terminal 1: Start the Django Backend Server

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend/transitops
   ```

2. **Create and activate a Python Virtual Environment:**
   ```powershell
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\activate

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install required Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Apply database migrations (Sync with MongoDB):**
   ```bash
   python manage.py migrate
   ```

5. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```
   *The backend REST API server will now be live at:* **`http://127.0.0.1:8000/`**

---

### 🌐 Terminal 2: Start the Vite Frontend Server

1. **Navigate to the Frontend React directory:**
   ```bash
   cd Frontend/transitops
   ```

2. **Install Node modules & dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The frontend web application will now be live at:* **`http://localhost:5173/`**

---

<a id="team-members"></a>
## 👥 Team Members

| Name | Role / Responsibility | GitHub |
| :--- | :--- | :--- |
| **Team Lead / Full-Stack Engineer** | Project Architecture, Django REST API, MongoDB Integration, UI/UX Design | [@sjdobaria](https://github.com/sjdobaria) |
| **Frontend Developer** | React Components, Recharts Analytics, Tailwind Glassmorphism Styling | [@TirthPanchal123](https://github.com/TirthPanchal123) |

---

<div align="center">
  <p align="center">© 2026 TransitOps. Built for future-ready transport and logistics operations.</p>
</div>
