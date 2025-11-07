import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Wheat, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';

interface MyListingsPageProps {
  onNavigateBack: () => void;
}

export const MyListingsPage = ({ onNavigateBack }: MyListingsPageProps) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold';
      case 'pending': return 'Under Review';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onNavigateBack}
              variant="outline"
              className="px-8 py-4 text-lg font-semibold"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('myListings.backToSell')}
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {t('myListings.title')}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {t('myListings.subtitle')}
              </p>
            </div>
          </div>
          <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
            <DialogTrigger asChild>
              <Button className="px-6 py-3 text-lg font-semibold">
                <Plus className="mr-2 h-5 w-5" />
                {t('myListings.addNewListing')}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">{t('myListings.totalListings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{residueListings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-green-800">{t('myListings.available')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {residueListings.filter(l => l.status === 'available').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-800">{t('myListings.sold')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {residueListings.filter(l => l.status === 'sold').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-yellow-800">{t('myListings.totalValue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                ₹{residueListings.reduce((sum, l) => sum + (l.price_per_ton * l.quantity_tons), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Residue Listings Grid */}
        {residueListings.length === 0 ? (
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="text-center py-16">
              <Wheat className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('myListings.noListingsTitle')}</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('myListings.noListingsDescription')}
              </p>
              <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Plus className="mr-2 h-6 w-6" />
                    {t('myListings.addFirstListing')}
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residueListings.map((listing: any) => (
              <Card key={listing.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl capitalize font-bold">
                      {listing.crop_type.replace('_', ' ')}
                    </CardTitle>
                    <Badge variant={getStatusColor(listing.status)} className="text-sm px-3 py-1">
                      {getStatusText(listing.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600 block text-sm">{t('myListings.quantity')}</span>
                      <p className="font-semibold text-lg">{listing.quantity_tons} tons</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600 block text-sm">{t('myListings.pricePerTon')}</span>
                      <p className="font-semibold text-lg">₹{listing.price_per_ton.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="text-gray-600 text-sm">{t('myListings.disposalMethod')}</span>
                    <p className="font-medium capitalize text-green-800">
                      {listing.disposal_method.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {listing.harvest_date && (
                    <div>
                      <span className="text-gray-600 text-sm">{t('myListings.harvestDate')}</span>
                      <p className="font-medium">
                        {new Date(listing.harvest_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">{t('myListings.totalValue')}</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{(listing.price_per_ton * listing.quantity_tons).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('myListings.listed')}: {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};