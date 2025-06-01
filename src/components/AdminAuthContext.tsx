"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// For production, set NEXT_PUBLIC_ADMIN_PASSWORD environment variable
// Example: NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Prach!@Blog$';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in (stored in localStorage)
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdmin,
      login,
      logout,
      showLoginModal,
      setShowLoginModal
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}

// Admin Login Modal Component
export function AdminLoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-pink-400 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors font-bold"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 