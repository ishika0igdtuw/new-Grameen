import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Clock, Wheat, Users } from 'lucide-react';

export const PanchayatVerificationDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanchayatData();
  }, [profile]);

  const fetchPanchayatData = async () => {
    if (!profile) return;

    try {
      // Fetch pending listings for verification
      const { data: pendingData, error: pendingError } = await supabase
        .from('crop_residue_listings')
        .select(`
          *,
          farmers!inner(farmer_name, village),
          panchayats!inner(name, admin_id)
        `)
        .eq('panchayats.admin_id', profile.id)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;

      // Fetch aggregated data
      const { data: aggregatedData, error: aggregatedError } = await supabase
        .from('aggregated_crop_listings')
        .select('*')
        .eq('panchayat_id', (await getPanchayatId()));

      if (aggregatedError) throw aggregatedError;

      setPendingListings(pendingData || []);
      setAggregatedData(aggregatedData || []);
    } catch (error) {
      console.error('Error fetching panchayat data:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load panchayat data',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPanchayatId = async () => {
    if (!profile) return null;
    const { data } = await supabase
      .from('panchayats')
      .select('id')
      .eq('admin_id', profile.id)
      .single();
    return data?.id;
  };

  const handleVerification = async (listingId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('crop_residue_listings')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verified_by: profile!.id
        })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Listing ${status} successfully`,
      });

      fetchPanchayatData(); // Refresh data
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update verification status',
        variant: "destructive"
      });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panchayat Verification Dashboard
        </h1>
        <p className="text-muted-foreground">
          Verify farmer listings and view aggregated marketplace data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingListings.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {aggregatedData.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {aggregatedData.reduce((sum, item) => sum + (item.farmer_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {aggregatedData.reduce((sum, item) => sum + (item.total_quantity_tons || 0), 0).toFixed(1)} tons
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Verifications
          </CardTitle>
          <CardDescription>
            Review and approve/reject farmer crop residue listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingListings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No pending listings to verify at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingListings.map((listing: any) => (
                <Card key={listing.id} className="border-2 border-orange-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">
                        {listing.crop_type.replace('_', ' ')}
                      </CardTitle>
                      <Badge variant={getVerificationStatusColor(listing.verification_status)}>
                        {listing.verification_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By: {listing.farmers?.farmer_name} - {listing.farmers?.village}
                    </p>
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
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleVerification(listing.id, 'approved')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleVerification(listing.id, 'rejected')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aggregated Marketplace Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Aggregated Marketplace Listings
          </CardTitle>
          <CardDescription>
            Bulk listings available for industries to purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aggregatedData.length === 0 ? (
            <div className="text-center py-8">
              <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No aggregated listings</h3>
              <p className="text-muted-foreground">
                Approve farmer listings to create bulk marketplace offerings
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aggregatedData.map((listing: any) => (
                <Card key={`${listing.panchayat_id}-${listing.crop_type}-${listing.disposal_method}`} 
                      className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">
                      {listing.crop_type.replace('_', ' ')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {listing.village}, {listing.district}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Quantity:</span>
                        <p className="font-medium text-lg text-green-600">
                          {listing.total_quantity_tons} tons
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Price:</span>
                        <p className="font-medium">₹{Math.round(listing.avg_price_per_ton)}/ton</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {listing.farmer_count} contributing farmers
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Method:</span>
                      <p className="font-medium capitalize">
                        {listing.disposal_method.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Value:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{Math.round(listing.total_quantity_tons * listing.avg_price_per_ton).toLocaleString()}
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