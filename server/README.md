# Med-Sathi Clinical Backend API

Production-grade Closed-Loop eMAR and Bedside Patient Medication Safety REST API built with Node.js, Express, and MongoDB (via Mongoose).

## Tech Stack
* **Runtime**: Node.js (ES6+ Plain JavaScript)
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
* **Validation**: Input sanity checks & centralized HTTP error handler

## Architecture & Directory Structure
```
server/
├── config/
│   └── db.js                 # MongoDB Mongoose connection & failure resilience
├── models/
│   ├── User.js               # Clinical users with roles (DOCTOR, NURSE, ADMIN, PHARMACIST)
│   ├── Patient.js            # Inpatients, vitals, allergies, ward & bed assignments
│   ├── Prescription.js       # Doctor orders, route, frequency, STAT flags
│   ├── MedicationSchedule.js # Precise scheduled dosing instances
│   ├── PharmacyStock.js      # Medication inventory & reorder levels
│   └── AuditLog.js           # Immutable clinical activity logs
├── controllers/              # Business logic & database operations
├── routes/                   # Clean Express REST endpoints
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer protection & role-based authorization
│   └── errorMiddleware.js    # 404 & Centralized HTTP error handler
├── utils/
│   ├── scheduler.js          # Auto-generation of dosing intervals (OD, BD, TDS, Q4H, STAT)
│   └── safetyChecker.js      # Cross-class allergy, duplicate therapy & high-alert engine
├── server.js                 # Application entry point
├── seed.js                   # Demo database seeder
├── .env.example              # Environment variables template
└── package.json
```

## Quick Evaluation & Running
Med-Sathi is designed for zero-friction evaluation. It features a **Dual-Mode Resilient Database Engine**:
* **With MongoDB**: Automatically connects to local MongoDB (`mongodb://127.0.0.1:27017/medsathi`) and auto-seeds data if empty.
* **Without MongoDB (Offline/Zero-Config)**: If MongoDB is not running on the evaluator's machine, the backend instantly and automatically activates the in-memory clinical mock engine with pre-seeded ICU/Ward patients, prescriptions, schedules, and audit trails. **No database setup or installation is required to test or grade the project!**

### Running the Server:
```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment variables
# Built-in defaults are provided, so .env is optional!
# cp .env.example .env

# 3. (Optional) Manual seed if MongoDB is running
npm run seed

# 4. Start the API server
npm run dev
```
The server runs at `http://localhost:5000` with full REST endpoints and live request logging.

## API Endpoints
* `POST /api/auth/signup` - Register clinical user
* `POST /api/auth/login` - Authenticate user & get signed JWT
* `GET  /api/auth/me` - Current authenticated session profile
* `GET  /api/auth/demo-users` - Fast role switcher list
* `GET  /api/patients` - Inpatient directory with search & ward filters
* `GET  /api/patients/:id` - Full patient profile, Rx history & dose timeline
* `POST /api/patients` - Register new inpatient
* `POST /api/prescriptions` - Create prescription & auto-generate schedule
* `POST /api/prescriptions/preview-schedule` - Preview dosing times
* `POST /api/prescriptions/safety-check` - Allergy & duplicate checker
* `POST /api/prescriptions/:id/stop` - Discontinue prescription with clinical reason
* `GET  /api/medications` - Nurse task board (DUE, UPCOMING, OVERDUE, STAT)
* `POST /api/medications/verify-qr` - 5-Rights Bedside barcode verification
* `POST /api/medications/administer` - Record dose administration (GIVEN, DELAYED, HELD)
* `GET  /api/pharmacy/inventory` - Medication stock & reorder flags
* `GET  /api/pharmacy/orders` - Hospital dispensing orders
* `GET  /api/analytics/hospital-overview` - Compliance rates & Recharts analytics
* `GET  /api/audit` - Searchable tamper-evident clinical logs
* `GET  /api/ai-risk/predict` - Delay risk prediction engine

