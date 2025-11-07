import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PanchayatNavigationDashboard } from '@/components/dashboards/PanchayatNavigationDashboard';

export default function PanchayatManagePage() {
  const { user, profile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  if (profile.role !== 'panchayat_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section as 'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile');
  };

  return (
    <Layout onNavigate={handleNavigate} activeSection={activeSection}>
      <PanchayatNavigationDashboard activeSection={activeSection} onNavigate={handleNavigate} />
    </Layout>
  );
}