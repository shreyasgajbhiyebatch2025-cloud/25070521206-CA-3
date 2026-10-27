# Med-Sathi Clinical Client

A modern, minimal, search-first clinical eMAR and bedside patient safety web application inspired by the Aspen Search editorial aesthetic.

## Tech Stack
* **Language**: Plain JavaScript (ES6+ / JSX)
* **Framework**: React 18 (Functional Components & Hooks)
* **Routing**: React Router v6
* **HTTP Client**: Axios with automatic JWT injection & 401 interceptor
* **Data Visualization**: Recharts (Compliance rates, Ward breakdown, Dosing status)
* **Styling**: Tailwind CSS with custom Aspen palette:
  * `--alice-blue`: `#dcedff`
  * `--powder-blue`: `#94b0da`
  * `--lavender-grey`: `#8f91a2`
  * `--charcoal`: `#505a5b`
  * `--onyx`: `#121616`
* **Icons**: Lucide React
* **Build Tool**: Vite

## Key Pages & Workflows
* **Landing Page (`/`)**: Public search-first showcase with interactive hero query bar.
* **Authentication (`/login`, `/signup`)**: Secure JWT login with 1-click quick persona switcher.
* **Dashboard (`/dashboard`)**: Inpatient metrics, compliance charts, and urgent STAT banner.
* **Patients (`/patients`)**: Inpatient directory, admission registration, EMR profiles, and bedside QR wristbands.
* **Prescriptions (`/prescriptions`)**: Physician e-prescribing, real-time allergy cross-reactivity warnings, and DDI safety matrix.
* **Medications (`/medications`)**: Nurse task board, 5-rights bedside barcode verification, and administration modals.
* **Pharmacy (`/pharmacy`)**: Active inpatient dispensing demand queue and inventory stock tracking.
* **Audit (`/audit`)**: Searchable tamper-evident clinical logs with JSON export.
* **Profile / Settings (`/profile`)**: Staff identity, role switcher hub, and dark/light mode toggle.
* **404 Not Found (`*`)**: Minimalist recovery view.

## Setup & Running for Evaluators
Med-Sathi includes **1-Click Evaluator Fast-Pass Personas** so evaluators never have to remember or type test credentials:
1. Open `http://localhost:3000` (interactive product landing page).
2. Click **Sign In** or scroll to the Evaluator Access strip.
3. Simply click any persona badge:
   * **Doctor** (Dr. Aisha Khan - Cardiology & CPOE orders)
   * **Nurse** (Staff Nurse Sarah Jenkins - Bedside 5-Rights scanner)
   * **Pharmacist** (Marcus Vance, RPh - Inpatient dispensing bay)
   * **Admin** (Dir. Elena Rostova - Compliance & hospital audit)
4. Each persona instantly launches into its own **dedicated role-specific dashboard interface**!

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

The application runs at `http://localhost:3000` and automatically communicates with the backend at port `5000`. If the backend is ever stopped, the client also includes a graceful client-side mock fallback so the UI never displays a blank white screen.

