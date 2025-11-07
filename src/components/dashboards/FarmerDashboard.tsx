import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useTranslatedText } from '@/lib/translationUtils';
import { Wheat, ArrowRight } from 'lucide-react';
import { FarmerProfileSetupForm } from '@/components/forms/FarmerProfileSetupForm';
import { FarmerLandingPage } from '@/components/FarmerLandingPage';
import { FarmerResidueManagement } from '@/components/FarmerResidueManagement';
import { FarmerPaymentHistory } from '@/components/FarmerPaymentHistory';
import { FarmerMachineBooking } from '@/components/FarmerMachineBooking';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { SellResiduePage } from '@/components/SellResiduePage';
import { MyListingsPage } from '@/components/MyListingsPage';

interface FarmerData {
  farmerProfile: any;
  residueListings: any[];
  machineBookings: any[];
  totalEarnings: number;
}

interface FarmerDashboardProps {
  activeSection?: 'dashboard' | 'sell-residue' | 'my-listings' | 'rent-machinery' | 'analytics' | 'profile' | 'residue-management' | 'payment-history' | 'marketplace' | 'orders';
  onNavigate?: (section: 'dashboard' | 'sell-residue' | 'my-listings' | 'rent-machinery' | 'analytics' | 'profile' | 'residue-management' | 'payment-history' | 'marketplace' | 'orders') => void;
}

export const FarmerDashboard = ({ activeSection = 'dashboard', onNavigate }: FarmerDashboardProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { translateFarmerProfile } = useTranslatedText();
  const [data, setData] = useState<FarmerData>({
    farmerProfile: null,
    residueListings: [],
    machineBookings: [],
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  // Remove internal state as navigation is now handled by parent

  useEffect(() => {
    fetchFarmerData();
  }, [profile]);

  const fetchFarmerData = async () => {
    if (!profile) return;

    try {
      // Fetch farmer profile
      const { data: farmerProfile, error: farmerError } = await supabase
        .from('farmers')
        .select(`
          *,
          panchayats (
            name,
            village,
            district,
            state
          )
        `)
        .eq('profile_id', profile.id)
        .single();

      if (farmerError && farmerError.code !== 'PGRST116') {
        console.error('Error fetching farmer profile:', farmerError);
        setLoading(false);
        return;
      }

      if (!farmerProfile) {
        setLoading(false);
        return;
      }

      // Fetch residue listings
      const { data: residueListings, error: residueError } = await supabase
        .from('crop_residue_listings')
        .select('*')
        .eq('farmer_id', farmerProfile.id)
        .order('created_at', { ascending: false });

      if (residueError) {
        console.error('Error fetching residue listings:', residueError);
      }

      // Fetch machine bookings
      const { data: machineBookings, error: bookingsError } = await supabase
        .from('machine_bookings')
        .select('*')
        .eq('farmer_id', farmerProfile.id)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching machine bookings:', bookingsError);
      }

      // Calculate total earnings from farmer payment distributions
      const { data: paymentDistributions, error: paymentError } = await supabase
        .from('farmer_payment_distributions')
        .select('payment_amount')
        .eq('farmer_id', farmerProfile.id);

      if (paymentError) {
        console.error('Error fetching payment distributions:', paymentError);
      }

      const totalEarnings = paymentDistributions?.reduce((sum, payment) => 
        sum + (typeof payment.payment_amount === 'string' ? parseFloat(payment.payment_amount) : payment.payment_amount), 0) || 0;

      setData({
        farmerProfile,
        residueListings: residueListings || [],
        machineBookings: machineBookings || [],
        totalEarnings
      });

    } catch (error) {
      console.error('Error fetching farmer data:', error);
      toast({
        title: t('common.error'),
        description: t('farmer.failedToLoadData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data.farmerProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wheat className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{t('farmer.welcomeFarmer')}</CardTitle>
                <CardDescription>
                  Complete your farmer profile to get started
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FarmerProfileSetupForm onSuccess={fetchFarmerData} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'sell-residue':
        return (
          <SellResiduePage 
            onNavigateToListings={() => onNavigate?.('my-listings')}
            showFormDirectly={true}
          />
        );
      case 'my-listings':
        return (
          <MyListingsPage 
            onNavigateBack={() => onNavigate?.('sell-residue')}
          />
        );
      case 'rent-machinery':
        return <FarmerMachineBooking />;
      case 'analytics':
        return (
          <div className="max-w-7xl mx-auto p-6">
            <AnalyticsDashboard 
              key={`farmer-analytics-${data.farmerProfile?.id}-${data.residueListings.length}`}
              farmerId={data.farmerProfile?.id} 
            />
          </div>
        );
      case 'residue-management':
        return <FarmerResidueManagement />;
      case 'payment-history':
        return <FarmerPaymentHistory />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('profilePage.editProfile')}</CardTitle>
                <CardDescription>
                  {t('profilePage.personalInformation')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-6 bg-green-50 rounded-lg border">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <Wheat className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      {(() => {
                        const translatedProfile = translateFarmerProfile(
                          data.farmerProfile?.farmer_name,
                          data.farmerProfile?.village,
                          data.farmerProfile?.panchayats?.name,
                          data.farmerProfile?.panchayats?.district,
                          data.farmerProfile?.panchayats?.state
                        );
                        return (
                          <>
                            <h3 className="text-xl font-bold text-green-900">{translatedProfile.name}</h3>
                            <p className="text-green-700">{translatedProfile.village}, {translatedProfile.panchayat}</p>
                            <p className="text-green-600">{translatedProfile.district}, {translatedProfile.state}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Farming Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('profilePage.landAreaAcres')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {data.farmerProfile?.total_land_area || 0} {t('profilePage.acres')}
                        </div>
                        <p className="text-muted-foreground">{t('profilePage.farmingInformation')}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('profilePage.cropsYouGrow')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {data.farmerProfile?.primary_crops ? 
                            data.farmerProfile.primary_crops.map((crop: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {crop.charAt(0).toUpperCase() + crop.slice(1)}
                              </span>
                            )) : 
                            <span className="text-muted-foreground">{t('profilePage.notSet')}</span>
                          }
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('profilePage.personalInformation')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p><span className="font-medium">{t('profilePage.phoneNumber')}:</span> {data.farmerProfile?.phone || t('profilePage.notSet')}</p>
                          <p><span className="font-medium">WhatsApp:</span> {data.farmerProfile?.whatsapp_number || t('profilePage.notSet')}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('profilePage.farmingInformation')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                          {data.farmerProfile?.farming_experience || 0} years
                        </div>
                        <p className="text-muted-foreground">Agricultural experience</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="pt-6 border-t">
                    <Button 
                      onClick={() => {
                        // You can add a toggle state for edit mode if needed
                        console.log('Edit profile');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {t('profilePage.editProfile')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <FarmerLandingPage 
            onNavigate={(section) => {
              onNavigate?.(section as any);
            }}
            farmerData={{
              farmer_name: data.farmerProfile?.farmer_name,
              village: data.farmerProfile?.village,
              panchayats: { 
                name: data.farmerProfile?.panchayats?.name,
                id: data.farmerProfile?.panchayat_id
              },
              residueCount: data.residueListings.filter(l => l.status === 'available').length,
              machineBookings: data.machineBookings.filter(b => b.status === 'pending' || b.status === 'approved').length,
              totalEarnings: data.totalEarnings
            }}
          />
        );
    }
  };

  // Navigation is now handled by Layout component
  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};