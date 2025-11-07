import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { PanchayatDashboard } from '@/components/dashboards/PanchayatDashboard';
import { IndustryDashboard } from '@/components/dashboards/IndustryDashboard';
import { FarmerDashboard } from '@/components/dashboards/FarmerDashboard';
import { LandingPage } from '@/components/LandingPage';

const Index = () => {
  const { profile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'sell-residue' | 'my-listings' | 'rent-machinery' | 'analytics' | 'profile' | 'residue-management' | 'payment-history' | 'marketplace' | 'orders'>('dashboard');

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

  if (!profile) {
    return <LandingPage />;
  }

  const renderDashboard = () => {
    switch (profile.role) {
      case 'panchayat_admin':
        return <PanchayatDashboard />;
      case 'buyer':
      case 'industry':
        return <IndustryDashboard activeSection={activeSection as 'dashboard' | 'marketplace' | 'orders' | 'profile'} onNavigate={(section) => setActiveSection(section as any)} />;
      case 'farmer':
        return <FarmerDashboard activeSection={activeSection} onNavigate={setActiveSection} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout 
      onNavigate={(profile?.role === 'farmer' || profile?.role === 'buyer' || profile?.role === 'industry') ? (section) => setActiveSection(section as any) : undefined}
      activeSection={(profile?.role === 'farmer' || profile?.role === 'buyer' || profile?.role === 'industry') ? activeSection : undefined}
    >
      {renderDashboard()}
    </Layout>
  );
};

export default Index;