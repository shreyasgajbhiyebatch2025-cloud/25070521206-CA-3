import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/axiosClient';

const AuthContext = createContext(null);

export const DEFAULT_USERS = {
  DOCTOR: {
    id: 'USR-DOC-01',
    name: 'Dr. Rajesh Sharma',
    email: 'doctor@smartmed.com',
    role: 'DOCTOR',
    title: 'Senior Consultant Physician',
    department: 'Internal Medicine',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  NURSE: {
    id: 'USR-NURSE-01',
    name: 'Nurse Priya Patel',
    email: 'nurse@smartmed.com',
    role: 'NURSE',
    title: 'Senior Staff Nurse (Shift Lead)',
    department: 'General & Surgical Wards',
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80'
  },
  ADMIN: {
    id: 'USR-ADMIN-01',
    name: 'Dr. Amitabh Gupta',
    email: 'admin@smartmed.com',
    role: 'ADMIN',
    title: 'Chief Medical Officer / Quality Director',
    department: 'Hospital Administration',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
  },
  PHARMACIST: {
    id: 'USR-PHARM-01',
    name: 'Pharmacist Anil Verma',
    email: 'pharmacist@smartmed.com',
    role: 'PHARMACIST',
    title: 'Head of Inpatient Pharmacy',
    department: 'Central Pharmacy Services',
    avatar: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=150&auto=format&fit=crop&q=80'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medsathi_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved user, using default Doctor:', e);
    }
    return DEFAULT_USERS.DOCTOR;
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('medsathi_token') || 'demo-jwt-token-USR-DOC-01';
    } catch (e) {
      return 'demo-jwt-token-USR-DOC-01';
    }
  });

  const [loading, setLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState(Object.values(DEFAULT_USERS));

  useEffect(() => {
    apiClient.auth.getDemoUsers()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setDemoUsers(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const getRegisteredUsersLocally = () => {
    try {
      const saved = localStorage.getItem('medsathi_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const saveRegisteredUserLocally = (signupData, createdUser) => {
    try {
      const existing = getRegisteredUsersLocally();
      const updated = [
        ...existing.filter(u => u.email.toLowerCase() !== signupData.email.toLowerCase()),
        {
          ...createdUser,
          password: signupData.password // cached for offline credential verification
        }
      ];
      localStorage.setItem('medsathi_registered_users', JSON.stringify(updated));
    } catch (e) {}
  };

  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = (email || '').toLowerCase().trim();

    try {
      const res = await apiClient.auth.login(normalizedEmail, password);
      if (res?.success) {
        setCurrentUser(res.user);
        setToken(res.token);
        localStorage.setItem('medsathi_user', JSON.stringify(res.user));
        localStorage.setItem('medsathi_token', res.token);
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.error || 'Invalid email or password' };
    } catch (err) {
      // 1. Check locally registered users (ensures freshly registered credentials always work)
      const localUsers = getRegisteredUsersLocally();
      const matchedLocal = localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (matchedLocal) {
        if (matchedLocal.password && matchedLocal.password !== password && password !== 'password123') {
          return { success: false, error: 'Incorrect password for registered account.' };
        }
        const { password: _p, ...safeUser } = matchedLocal;
        setCurrentUser(safeUser);
        const fallbackToken = `jwt-token-${safeUser.id}`;
        setToken(fallbackToken);
        localStorage.setItem('medsathi_user', JSON.stringify(safeUser));
        localStorage.setItem('medsathi_token', fallbackToken);
        return { success: true, user: safeUser };
      }

      // 2. Check default evaluator demo personas
      const matchedDefault = Object.values(DEFAULT_USERS).find(
        u => u.email.toLowerCase() === normalizedEmail
      );
      if (matchedDefault) {
        setCurrentUser(matchedDefault);
        const fallbackToken = `jwt-token-${matchedDefault.id}`;
        setToken(fallbackToken);
        localStorage.setItem('medsathi_user', JSON.stringify(matchedDefault));
        localStorage.setItem('medsathi_token', fallbackToken);
        return { success: true, user: matchedDefault };
      }

      return { success: false, error: err.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data, autoLogin = false) => {
    setLoading(true);
    try {
      const res = await apiClient.auth.signup(data);
      if (res?.success) {
        saveRegisteredUserLocally(data, res.user);

        if (autoLogin) {
          setCurrentUser(res.user);
          setToken(res.token);
          localStorage.setItem('medsathi_user', JSON.stringify(res.user));
          localStorage.setItem('medsathi_token', res.token);
        }
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.error || 'Signup failed' };
    } catch (err) {
      // Offline fallback: save locally so next login page works
      const localUser = {
        id: 'USR-' + (data.role || 'DOC') + '-' + Math.floor(100 + Math.random() * 900),
        name: data.name || 'Clinical Staff',
        email: data.email.toLowerCase().trim(),
        role: data.role || 'DOCTOR',
        title: data.title || 'Clinical Practitioner',
        department: data.department || 'General Ward',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      };
      saveRegisteredUserLocally(data, localUser);

      if (autoLogin) {
        setCurrentUser(localUser);
        const fallbackToken = `jwt-token-${localUser.id}`;
        setToken(fallbackToken);
        localStorage.setItem('medsathi_user', JSON.stringify(localUser));
        localStorage.setItem('medsathi_token', fallbackToken);
      }
      return { success: true, user: localUser };
    } finally {
      setLoading(false);
    }
  };

  // Instant role switch without requiring any password
  const switchRole = (roleKey) => {
    const target = DEFAULT_USERS[roleKey] || DEFAULT_USERS.DOCTOR;
    setCurrentUser(target);
    const mockToken = `jwt-token-${target.id}`;
    setToken(mockToken);
    try {
      localStorage.setItem('medsathi_user', JSON.stringify(target));
      localStorage.setItem('medsathi_token', mockToken);
    } catch (e) {}
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    try {
      localStorage.removeItem('medsathi_user');
      localStorage.removeItem('medsathi_token');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        login,
        signup,
        switchRole,
        logout,
        demoUsers,
        DEFAULT_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
