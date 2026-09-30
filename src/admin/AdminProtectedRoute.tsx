import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminProtectedRoute: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-xs">Authenticating admin privileges...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
