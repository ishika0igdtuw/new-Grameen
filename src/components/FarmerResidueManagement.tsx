import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Wheat, Plus } from 'lucide-react';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';

export const FarmerResidueManagement = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [residueListings, setResidueListings] = useState<any[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResidueForm, setShowResidueForm] = useState(false);

  useEffect(() => {
    fetchResidueData();
  }, [profile]);

  const fetchResidueData = async () => {
    if (!profile) return;

    try {
      // Fetch farmer profile
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('profile_id', profile.id)
        .single();

      if (farmerError) {
        console.error('Error fetching farmer profile:', farmerError);
        setLoading(false);
        return;
      }

      setFarmerProfile(farmerData);

      // Fetch residue listings
      const { data: residueData, error: residueError } = await supabase
        .from('crop_residue_listings')
        .select('*')
        .eq('farmer_id', farmerData.id)
        .order('created_at', { ascending: false });

      if (residueError) {
        console.error('Error fetching residue listings:', residueError);
      } else {
        setResidueListings(residueData || []);
      }

    } catch (error) {
      console.error('Error fetching residue data:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load residue data',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'secondary';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Crop Residue Management
          </h1>
          <p className="text-muted-foreground">
            List and manage your crop residues for sale
          </p>
        </div>
        <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ResidueListingForm 
              onSuccess={() => {
                setShowResidueForm(false);
                fetchResidueData();
              }}
              onCancel={() => setShowResidueForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residueListings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {residueListings.filter(l => l.status === 'available').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {residueListings.filter(l => l.status === 'sold').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{residueListings.reduce((sum, l) => sum + (l.price_per_ton * l.quantity_tons), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Residue Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Crop Residue Listings</CardTitle>
          <CardDescription>
            Manage all your crop residue listings in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {residueListings.length === 0 ? (
            <div className="text-center py-12">
              <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No residue listings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first crop residue listing to connect with buyers
              </p>
              <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <ResidueListingForm 
                    onSuccess={() => {
                      setShowResidueForm(false);
                      fetchResidueData();
                    }}
                    onCancel={() => setShowResidueForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residueListings.map((listing: any) => (
                <Card key={listing.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">
                        {listing.crop_type.replace('_', ' ')}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                        <Badge variant={getVerificationStatusColor(listing.verification_status)}>
                          {listing.verification_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{listing.quantity_tons} tons</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">₹{listing.price_per_ton}/ton</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Method:</span>
                      <p className="font-medium capitalize">
                        {listing.disposal_method.replace('_', ' ')}
                      </p>
                    </div>
                    
                    {listing.harvest_date && (
                      <div>
                        <span className="text-muted-foreground text-sm">Harvest Date:</span>
                        <p className="font-medium">
                          {new Date(listing.harvest_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Value:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{(listing.price_per_ton * listing.quantity_tons).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};