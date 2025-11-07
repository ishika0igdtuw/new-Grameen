import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PanchayatDashboard } from '@/components/dashboards/PanchayatDashboard';
import { FarmerDashboard } from '@/components/dashboards/FarmerDashboard';
import { BuyerDashboard } from '@/components/dashboards/BuyerDashboard';
import { IndustryDashboard } from '@/components/dashboards/IndustryDashboard';

export default function Dashboard() {
  const { user, profile, signOut, loading } = useAuth();

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

  const renderDashboard = () => {
    switch (profile.role) {
      case 'panchayat_admin':
        return <PanchayatDashboard />;
      case 'farmer':
        return <FarmerDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      case 'industry':
        return <IndustryDashboard />;
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
}