import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children, fallback }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || user.role !== 'Admin') {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#fdfbf7]">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-[#3d251c] mb-2 font-serif">403 - Access Denied</h2>
        <p className="text-sm text-[#81756f] max-w-md mb-6">
          You do not have permission to view the Admin Management Console. Please sign in with an Administrator account.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2.5 bg-[#dfa38f] text-white rounded-full font-medium hover:bg-[#b88673] transition-colors shadow-md text-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
