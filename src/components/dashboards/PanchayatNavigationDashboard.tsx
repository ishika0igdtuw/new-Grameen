import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Wheat, 
  Calendar, 
  DollarSign, 
  Plus, 
  Tractor, 
  CheckCircle, 
  XCircle,
  BarChart3,
  TrendingUp,
  Leaf,
  Award
} from 'lucide-react';
import { PanchayatRegistrationForm } from '@/components/forms/PanchayatRegistrationForm';
import { FarmerRegistrationForm } from '@/components/forms/FarmerRegistrationForm';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';

interface DashboardData {
  totalFarmers: number;
  totalResidueListings: number;
  pendingBookings: number;
  totalIncome: number;
  recentActivity: any[];
  machineBookings: any[];
}

interface PanchayatDashboardProps {
  activeSection?: 'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile';
  onNavigate?: (section: 'dashboard' | 'farmers' | 'residue' | 'machines' | 'analytics' | 'profile') => void;
}

export const PanchayatNavigationDashboard = ({ activeSection = 'dashboard', onNavigate }: PanchayatDashboardProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
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
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showResidueForm, setShowResidueForm] = useState(false);
  const [showPanchayatForm, setShowPanchayatForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

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

      setData({
        totalFarmers: farmersCount || 0,
        totalResidueListings: residueCount || 0,
        pendingBookings: bookingsCount || 0,
        totalIncome: Math.floor(Math.random() * 50000) + 10000, // Mock data
        recentActivity: recentListings || [],
        machineBookings: machineBookings || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
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
        title: "Success",
        description: `Booking ${status} successfully!`
      });

      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
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
      <div className="text-center py-12">
        <div className="mb-4">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Setup Your Panchayat</h2>
          <p className="text-muted-foreground mb-6">
            You need to register your Panchayat first to start managing farmers and crop residue.
          </p>
        </div>
        <Dialog open={showPanchayatForm} onOpenChange={setShowPanchayatForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Panchayat
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
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'farmers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Farmer Management</h1>
                <p className="text-muted-foreground">Manage and register farmers in your panchayat</p>
              </div>
              <Dialog open={showFarmerForm} onOpenChange={setShowFarmerForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farmer
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total Farmers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalFarmers}</div>
                  <p className="text-xs text-muted-foreground">Registered farmers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'residue':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Residue Management</h1>
                <p className="text-muted-foreground">View and manage crop residue listings</p>
              </div>
              <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
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

            {data.recentActivity.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wheat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No residue listings yet. Add farmers and encourage them to list crop residue.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.recentActivity.map((listing: any) => (
                  <Card key={listing.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'machines':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Machine Bookings</h1>
              <p className="text-muted-foreground">Manage machine booking requests from farmers</p>
            </div>

            {data.machineBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No machine booking requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.machineBookings.map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-muted-foreground">Track your panchayat's performance and environmental impact</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">₹{data.totalIncome.toLocaleString()}</div>
                  <p className="text-xs text-green-700 dark:text-green-300">From residue sales</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Wheat className="h-4 w-4" />
                    Active Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.totalResidueListings}</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Current listings</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Tractor className="h-4 w-4" />
                    Machine Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{data.machineBookings.length}</div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Total bookings</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">2.5T</div>
                  <p className="text-xs text-orange-700 dark:text-orange-300">CO2 saved</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Your panchayat's key achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium">Zero Stubble Burning</p>
                        <p className="text-sm text-muted-foreground">Achieved this season</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      100%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium">Farmer Engagement</p>
                        <p className="text-sm text-muted-foreground">Active participation rate</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      85%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panchayat Profile</h1>
              <p className="text-muted-foreground">View and manage your panchayat information</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900 dark:text-green-100">{panchayat.name}</h3>
                      <p className="text-green-700 dark:text-green-300">{panchayat.village}, {panchayat.district}</p>
                      <p className="text-green-600 dark:text-green-400">{panchayat.state}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          <strong>Phone:</strong> {panchayat.contact_number || 'Not provided'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Admin ID:</strong> {panchayat.admin_id}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Coverage Area</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          <strong>Population:</strong> {panchayat.population || 'Not specified'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Registered:</strong> {new Date(panchayat.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="pt-6 border-t">
                    <Button variant="outline" className="w-full">
                      Edit Panchayat Information
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        // Dashboard view - main overview
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Panchayat Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {panchayat.name} - {panchayat.village}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showFarmerForm} onOpenChange={setShowFarmerForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Farmer
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
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
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
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalFarmers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered farmers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Residue Listings</CardTitle>
                  <Wheat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalResidueListings}</div>
                  <p className="text-xs text-muted-foreground">
                    Active listings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Machine bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{data.totalIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    From residue sales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('residue')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="h-5 w-5" />
                    Crop Residue ({data.totalResidueListings})
                  </CardTitle>
                  <CardDescription>
                    View and manage residue listings from farmers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Latest listing: {data.recentActivity[0] ? 
                      new Date(data.recentActivity[0].created_at).toLocaleDateString() : 
                      'None yet'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('machines')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tractor className="h-5 w-5" />
                    Machine Bookings ({data.pendingBookings})
                  </CardTitle>
                  <CardDescription>
                    Approve machine rental requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pending requests need your attention
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};