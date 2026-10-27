import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { apiClient } from './api/axiosClient';

// Layout & Global Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AiDelayRiskModal } from './components/ai/AiDelayRiskModal';
import CodeBlueModal from './components/emergency/CodeBlueModal';
import ClinicalChatbot from './components/common/ClinicalChatbot';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { AuditPage } from './pages/AuditPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { currentUser, token } = useAuth();
  const location = useLocation();

  if (!currentUser && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function App() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [codeBlueOpen, setCodeBlueOpen] = useState(false);
  const [patients, setPatients] = useState([]);

  // Fetch hospital inpatients for global modals (Code Blue, Chatbot)
  useEffect(() => {
    if (currentUser) {
      apiClient.patients.getAll()
        .then(res => setPatients(res.data || []))
        .catch(() => {});
    }
  }, [currentUser]);

  const isStandalonePage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-onyx text-text-primary transition-colors selection:bg-powder-blue selection:text-onyx relative">
      
      {/* Top Sticky Glass Navbar for Application Pages */}
      {!isStandalonePage && (
        <Navbar
          onOpenAiModal={() => setAiModalOpen(true)}
          onOpenCodeBlue={() => setCodeBlueOpen(true)}
        />
      )}

      {/* Main Dynamic View Content */}
      <main className={isStandalonePage ? "flex-1 w-full" : "flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Protected Routes (Require authenticated session) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <PrescriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <ProtectedRoute>
                <MedicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute>
                <PharmacyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <AuditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Minimal Swiss Footer */}
      {!isStandalonePage && <Footer />}

      {/* Global Modals & Copilot */}
      <AiDelayRiskModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      <CodeBlueModal
        isOpen={codeBlueOpen}
        onClose={() => setCodeBlueOpen(false)}
        patients={patients}
        currentUser={currentUser}
      />

      {currentUser && (
        <ClinicalChatbot
          currentUser={currentUser}
          patients={patients}
        />
      )}

    </div>
  );
}

export default App;
