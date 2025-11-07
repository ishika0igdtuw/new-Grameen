import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';

interface FarmerProtectedRouteProps {
  children: ReactNode;
}

export const FarmerProtectedRoute = ({ children }: FarmerProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || profile.role !== 'farmer') {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};