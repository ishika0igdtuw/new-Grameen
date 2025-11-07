import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Users, Wheat, Calendar, DollarSign, Plus, Tractor, CheckCircle, XCircle, Settings, BarChart3, Recycle, Building, Truck, Shield } from 'lucide-react';
import { PanchayatRegistrationForm } from '@/components/forms/PanchayatRegistrationForm';
import { FarmerRegistrationForm } from '@/components/forms/FarmerRegistrationForm';
import { PanchayatVerificationDashboard } from '@/components/PanchayatVerificationDashboard';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';
import panchayatFarmers from '@/assets/panchayat-farmers.jpg';

interface DashboardData {
  totalFarmers: number;
  totalResidueListings: number;
  pendingBookings: number;
  totalIncome: number;
  recentActivity: any[];
  machineBookings: any[];
}

interface PanchayatDashboardProps {
  activeSection?: 'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile' | 'verification';
  onNavigate?: (section: 'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile' | 'verification') => void;
}

export const PanchayatDashboard = ({ activeSection = 'dashboard', onNavigate }: PanchayatDashboardProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState<'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile' | 'verification'>('dashboard');
  const [data, setData] = useState<DashboardData>({
    totalFarmers: 0,
    totalResidueListings: 0,
    pendingBookings: 0,
    totalIncome: 0,
    recentActivity: [],
    machineBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [panchayat, setPanchayat] = useState<any>(null);
  const [showPanchayatForm, setShowPanchayatForm] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showResidueForm, setShowResidueForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const calculatePanchayatTotalIncome = async (panchayatId: string) => {
    try {
      // Get all farmers in this panchayat
      const { data: farmers } = await supabase
        .from('farmers')
        .select('id')
        .eq('panchayat_id', panchayatId);

      if (!farmers || farmers.length === 0) return 0;

      const farmerIds = farmers.map(f => f.id);

      // Get all payment distributions for farmers in this panchayat
      const { data: payments } = await supabase
        .from('farmer_payment_distributions')
        .select('payment_amount')
        .in('farmer_id', farmerIds);

      return payments?.reduce((sum, payment) => 
        sum + (typeof payment.payment_amount === 'string' ? parseFloat(payment.payment_amount) : payment.payment_amount), 0) || 0;
    } catch (error) {
      console.error('Error calculating panchayat income:', error);
      return 0;
    }
  };

  const fetchDashboardData = async () => {
    if (!profile) return;

    try {
      // First check if panchayat exists for this admin
      const { data: panchayatData, error: panchayatError } = await supabase
        .from('panchayats')
        .select('*')
        .eq('admin_id', profile.id)
        .single();

      if (panchayatError && panchayatError.code !== 'PGRST116') {
        console.error('Error fetching panchayat:', panchayatError);
        return;
      }

      setPanchayat(panchayatData);

      if (!panchayatData) {
        setLoading(false);
        return;
      }

      // Fetch farmers count
      const { count: farmersCount } = await supabase
        .from('farmers')
        .select('*', { count: 'exact', head: true })
        .eq('panchayat_id', panchayatData.id);

      // Fetch residue listings count
      const { count: residueCount } = await supabase
        .from('crop_residue_listings')
        .select('*', { count: 'exact', head: true })
        .eq('panchayat_id', panchayatData.id);

      // Fetch pending bookings count
      const { count: bookingsCount } = await supabase
        .from('machine_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('panchayat_id', panchayatData.id)
        .eq('status', 'pending');

      // Fetch recent activity (residue listings and bookings)
      const { data: recentListings } = await supabase
        .from('crop_residue_listings')
        .select(`
          *,
          farmers (farmer_name)
        `)
        .eq('panchayat_id', panchayatData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch machine bookings
      const { data: machineBookings } = await supabase
        .from('machine_bookings')
        .select(`
          *,
          farmers (farmer_name)
        `)
        .eq('panchayat_id', panchayatData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate total income for the panchayat
      const totalIncome = await calculatePanchayatTotalIncome(panchayatData.id);

      setData({
        totalFarmers: farmersCount || 0,
        totalResidueListings: residueCount || 0,
        pendingBookings: bookingsCount || 0,
        totalIncome,
        recentActivity: recentListings || [],
        machineBookings: machineBookings || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: t('common.error'),
        description: t('farmer.failedToLoadData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'approved' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('machine_bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: `Booking ${status} successfully!`
      });

      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!panchayat) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {t('panchayatDashboard.welcomeToDigitalPanchayat')}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {t('panchayatDashboard.transformVillageAgricultural')}
                </p>
                <Dialog open={showPanchayatForm} onOpenChange={setShowPanchayatForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-5 w-5" />
                      {t('panchayatDashboard.registerYourPanchayat')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <PanchayatRegistrationForm onSuccess={() => {
                      setShowPanchayatForm(false);
                      fetchDashboardData();
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="lg:text-right">
                <img
                  src={panchayatFarmers}
                  alt="Farmers working in field"
                  className="rounded-lg shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('panchayatDashboard.comprehensiveManagementPlatform')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('panchayatDashboard.everythingYouNeed')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('panchayatDashboard.farmerManagement')}</h3>
                <p className="text-gray-600">{t('panchayatDashboard.registerAndManageFarmers')}</p>
              </Card>
              <Card className="text-center p-6">
                <Wheat className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('panchayatDashboard.cropResidue')}</h3>
                <p className="text-gray-600">{t('panchayatDashboard.trackAndManageCropResidue')}</p>
              </Card>
              <Card className="text-center p-6">
                <Tractor className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('panchayatDashboard.machineryBooking')}</h3>
                <p className="text-gray-600">{t('panchayatDashboard.approveAndManageFarm')}</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { key: 'dashboard', label: t('panchayatDashboard.dashboard'), icon: BarChart3 },
    { key: 'verification', label: t('panchayatDashboard.verification'), icon: CheckCircle },
    { key: 'residue', label: t('panchayatDashboard.residueManagement'), icon: Wheat },
    { key: 'machines', label: t('panchayatDashboard.machinery'), icon: Tractor },
    { key: 'analytics', label: t('panchayatDashboard.analytics'), icon: BarChart3 },
    { key: 'profile', label: t('panchayatDashboard.profile'), icon: Settings },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={panchayatFarmers}
                  alt="Panchayat managing farmers and crop residues"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/60"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
                <div className="text-center">
                  <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
                    {t('panchayatDashboard.panchayatDashboard').split(' ')[0]}
                    <span className="text-green-400 block">{t('panchayatDashboard.panchayatDashboard').split(' ')[1]}</span>
                  </h1>
                  
                  <p className="text-2xl md:text-3xl text-green-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                    {t('panchayatDashboard.manageYourCommunity')}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                  {t('panchayatDashboard.panchayatManagementFeatures')}
                </h2>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
                  {t('panchayatDashboard.comprehensiveTools')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <Users className="h-14 w-14 mx-auto mb-4 text-blue-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.farmerManagement')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.registerAndManageFarmers')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <Recycle className="h-14 w-14 mx-auto mb-4 text-green-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.residueTracking')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.monitorCropResidue')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <Building className="h-14 w-14 mx-auto mb-4 text-purple-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.industryOrders')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.manageOrdersFromIndustries')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <Truck className="h-14 w-14 mx-auto mb-4 text-orange-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.machineryLending')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.coordinateMachineryRentals')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <BarChart3 className="h-14 w-14 mx-auto mb-4 text-red-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.analytics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.trackProgressAndGenerate')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
                  <CardHeader className="text-center pb-4">
                    <Shield className="h-14 w-14 mx-auto mb-4 text-indigo-600" />
                    <CardTitle className="text-xl font-bold">{t('panchayatDashboard.compliance')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {t('panchayatDashboard.ensureEnvironmentalCompliance')}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Platform Stats */}
              <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-center mb-8 font-bold">Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{data.totalFarmers}</div>
                      <p className="text-green-100">Registered Farmers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{data.totalResidueListings}</div>
                      <p className="text-green-100">Residue Listings</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">₹{(data.totalIncome || 120000).toLocaleString()}</div>
                      <p className="text-green-100">Farmer Income</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">95%</div>
                      <p className="text-green-100">Burning Reduced</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-16">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Quick Actions</CardTitle>
                    <CardDescription>Manage your panchayat operations efficiently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dialog open={showFarmerForm} onOpenChange={setShowFarmerForm}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <Users className="h-8 w-8" />
                            Add New Farmer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <FarmerRegistrationForm 
                            onSuccess={() => {
                              setShowFarmerForm(false);
                              fetchDashboardData();
                            }}
                            onCancel={() => setShowFarmerForm(false)}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <Wheat className="h-8 w-8" />
                            Add Residue Listing
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <ResidueListingForm 
                            onSuccess={() => {
                              setShowResidueForm(false);
                              fetchDashboardData();
                            }}
                            onCancel={() => setShowResidueForm(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      
      case 'residue':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Residue Management</CardTitle>
              <CardDescription>Manage crop residue listings from farmers</CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No residue listings yet. Add farmers and encourage them to list crop residue.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentActivity.map((listing: any) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{listing.farmers?.farmer_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {listing.crop_type} • {listing.quantity_tons} tons • {listing.disposal_method}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing.price_per_ton ? `₹${listing.price_per_ton}/ton` : 'Price not set'} • 
                          {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={listing.status === 'available' ? 'default' : 'secondary'}>
                        {listing.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'machines':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Machinery Management</CardTitle>
              <CardDescription>Approve and manage farm machinery rental requests</CardDescription>
            </CardHeader>
            <CardContent>
              {data.machineBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No machine booking requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.machineBookings.map((booking: any) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{booking.farmers?.farmer_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.machine_type.replace('_', ' ').toUpperCase()} • ₹{booking.cost?.toLocaleString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            booking.status === 'pending' ? 'default' : 
                            booking.status === 'approved' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Duration:</strong> {booking.duration_hours} hours
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2 pt-3 border-t">
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'approved')}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>View detailed analytics and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="text-center p-4">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.totalFarmers}</div>
                  <p className="text-sm text-gray-600">Total Farmers</p>
                </Card>
                <Card className="text-center p-4">
                  <Wheat className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.totalResidueListings}</div>
                  <p className="text-sm text-gray-600">Residue Listings</p>
                </Card>
                <Card className="text-center p-4">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.pendingBookings}</div>
                  <p className="text-sm text-gray-600">Pending Bookings</p>
                </Card>
                <Card className="text-center p-4">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹{data.totalIncome.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Income</p>
                </Card>
              </div>
              <p className="text-muted-foreground text-center">Advanced analytics coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'verification':
        return <PanchayatVerificationDashboard />;

      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('panchayatDashboard.panchayatProfile')}</CardTitle>
              <CardDescription>{t('panchayatDashboard.manageYourPanchayatInfo')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('panchayatDashboard.panchayatName')}</label>
                  <p className="text-lg">{panchayat.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('panchayatDashboard.village')}</label>
                  <p className="text-lg">{panchayat.village}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('panchayatDashboard.block')}</label>
                  <p className="text-lg">{panchayat.block}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('panchayatDashboard.district')}</label>
                  <p className="text-lg">{panchayat.district}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('panchayatDashboard.state')}</label>
                  <p className="text-lg">{panchayat.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('panchayatDashboard.thisSectionUnderDevelopment')}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('panchayatDashboard.panchayatDashboard')}</h1>
          <p className="text-muted-foreground">
            {t('panchayatDashboard.welcomeBack')}, {panchayat.name} - {panchayat.village}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentSection(item.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  currentSection === item.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}

    </div>
  );
};