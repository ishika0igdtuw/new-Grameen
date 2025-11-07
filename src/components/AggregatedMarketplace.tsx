import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, MapPin, Users, Wheat, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const AggregatedMarketplace = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [aggregatedListings, setAggregatedListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [filters, setFilters] = useState({
    cropType: '',
    minQuantity: '',
    maxPrice: '',
    state: '',
    district: ''
  });

  useEffect(() => {
    fetchAggregatedListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [aggregatedListings, filters]);

  const fetchAggregatedListings = async () => {
    try {
      const { data, error } = await supabase
        .from('aggregated_crop_listings')
        .select('*')
        .order('total_quantity_tons', { ascending: false });

      if (error) throw error;

      setAggregatedListings(data || []);
    } catch (error) {
      console.error('Error fetching aggregated listings:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load marketplace listings',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...aggregatedListings];

    if (filters.cropType && filters.cropType !== 'all') {
      filtered = filtered.filter(listing => listing.crop_type === filters.cropType);
    }

    if (filters.minQuantity) {
      filtered = filtered.filter(listing => 
        listing.total_quantity_tons >= parseFloat(filters.minQuantity)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(listing => 
        listing.avg_price_per_ton <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.state && filters.state !== 'all') {
      filtered = filtered.filter(listing => 
        listing.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.district) {
      filtered = filtered.filter(listing => 
        listing.district.toLowerCase().includes(filters.district.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  };

  const handlePurchase = async (listing: any) => {
    if (!profile) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to make a purchase',
        variant: "destructive"
      });
      return;
    }

    try {
      const totalAmount = listing.total_quantity_tons * listing.avg_price_per_ton;

      // Create bulk purchase record
      const { data: bulkPurchase, error: purchaseError } = await supabase
        .from('bulk_purchases')
        .insert({
          panchayat_id: listing.panchayat_id,
          buyer_id: profile.id,
          crop_type: listing.crop_type,
          disposal_method: listing.disposal_method,
          total_quantity_tons: listing.total_quantity_tons,
          total_amount: totalAmount,
          avg_price_per_ton: listing.avg_price_per_ton,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Call function to create farmer payment distributions
      const { error: distributionError } = await supabase.rpc(
        'create_farmer_payment_distributions',
        {
          bulk_purchase_id_param: bulkPurchase.id,
          panchayat_id_param: listing.panchayat_id,
          crop_type_param: listing.crop_type,
          disposal_method_param: listing.disposal_method,
          total_purchase_amount: totalAmount
        }
      );

      if (distributionError) throw distributionError;

      toast({
        title: 'Purchase successful!',
        description: `You have purchased ${listing.total_quantity_tons} tons of ${listing.crop_type.replace('_', ' ')} for ₹${totalAmount.toLocaleString()}`,
      });

      setShowPurchaseDialog(false);
      fetchAggregatedListings(); // Refresh listings
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to complete purchase',
        variant: "destructive"
      });
    }
  };

  const getCropTypeOptions = () => {
    const cropTypes = [...new Set(aggregatedListings.map(listing => listing.crop_type))];
    return cropTypes;
  };

  const getStateOptions = () => {
    const states = [...new Set(aggregatedListings.map(listing => listing.state))];
    return states;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
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
          {t('analytics.cropResidueMarketplace')}
        </h1>
        <p className="text-muted-foreground">
          Browse and purchase bulk crop residue from verified farmers
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, cropType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Crop Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {getCropTypeOptions().map(crop => (
                  <SelectItem key={crop} value={crop}>
                    {crop.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Min Quantity (tons)"
              type="number"
              value={filters.minQuantity}
              onChange={(e) => setFilters(prev => ({ ...prev, minQuantity: e.target.value }))}
            />

            <Input
              placeholder="Max Price (₹/ton)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />

            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {getStateOptions().map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="District"
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredListings.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredListings.reduce((sum, item) => sum + item.total_quantity_tons, 0).toFixed(1)} tons
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredListings.reduce((sum, item) => sum + item.farmer_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{filteredListings.reduce((sum, item) => 
                sum + (item.total_quantity_tons * item.avg_price_per_ton), 0
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          filteredListings.map((listing: any) => (
            <Card key={`${listing.panchayat_id}-${listing.crop_type}-${listing.disposal_method}`} 
                  className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {listing.crop_type.replace('_', ' ')}
                  </CardTitle>
                  <Badge variant="default">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {listing.village}, {listing.district}, {listing.state}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
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
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Total Value:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{Math.round(listing.total_quantity_tons * listing.avg_price_per_ton).toLocaleString()}
                    </span>
                  </div>
                  
                  <Dialog open={showPurchaseDialog && selectedListing?.panchayat_id === listing.panchayat_id} 
                          onOpenChange={setShowPurchaseDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedListing(listing)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase Bulk
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">Purchase Details:</h4>
                          <p><strong>Crop:</strong> {selectedListing?.crop_type.replace('_', ' ')}</p>
                          <p><strong>Location:</strong> {selectedListing?.village}, {selectedListing?.district}</p>
                          <p><strong>Quantity:</strong> {selectedListing?.total_quantity_tons} tons</p>
                          <p><strong>Price per ton:</strong> ₹{Math.round(selectedListing?.avg_price_per_ton || 0)}</p>
                          <p><strong>Total Amount:</strong> ₹{Math.round((selectedListing?.total_quantity_tons || 0) * (selectedListing?.avg_price_per_ton || 0)).toLocaleString()}</p>
                          <p><strong>Contributing Farmers:</strong> {selectedListing?.farmer_count}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handlePurchase(selectedListing)}
                            className="flex-1"
                          >
                            Confirm Purchase
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowPurchaseDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};