import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Wheat, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';

export default function ResidueListingPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  useEffect(() => {
    fetchListings();
  }, [profile]);

  useEffect(() => {
    // Filter listings based on search query
    const filtered = listings.filter(listing => 
      listing.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.disposal_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [listings, searchQuery]);

  const fetchListings = async () => {
    if (!profile) return;

    try {
      // First get farmer profile
      const { data: farmerProfile, error: farmerError } = await supabase
        .from('farmers')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (farmerError || !farmerProfile) {
        console.error('Error fetching farmer profile:', farmerError);
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
        toast({
          title: t('common.error'),
          description: t('farmer.failedToLoadResidueListings'),
          variant: "destructive"
        });
      } else {
        setListings(residueListings || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('common.error'),
        description: t('farmer.failedToLoadData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm(t('farmer.areYouSureDelete'))) return;

    try {
      const { error } = await supabase
        .from('crop_residue_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('farmer.listingDeletedSuccess')
      });
      
      fetchListings();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'secondary';
      case 'reserved': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold text-foreground">{t('farmer.residueListings')}</h1>
          <p className="text-muted-foreground">
            {t('farmer.manageCropResidueListings')}
          </p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('farmer.addNewListing')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ResidueListingForm 
              onSuccess={() => {
                setShowAddForm(false);
                fetchListings();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('farmer.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {searchQuery ? t('farmer.noListingsMatchSearch') : t('farmer.noCropResidueListingsYet')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? t('farmer.tryAdjustingSearch')
              : t('farmer.createFirstListing')
            }
          </p>
          {!searchQuery && (
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('farmer.addYourFirstListing')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <ResidueListingForm 
                  onSuccess={() => {
                    setShowAddForm(false);
                    fetchListings();
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {listing.crop_type.charAt(0).toUpperCase() + listing.crop_type.slice(1)}
                  </CardTitle>
                  <Badge variant={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
                <CardDescription>
                  {t('farmer.addedOn')} {new Date(listing.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">{t('farmer.quantity')}:</span>
                    <p className="font-semibold">{listing.quantity_tons} {t('farmer.tons')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">{t('farmer.price')}:</span>
                    <p className="font-semibold">
                      {listing.price_per_ton ? `₹${listing.price_per_ton}/ton` : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">{t('farmer.method')}:</span>
                    <p className="font-semibold capitalize">
                      {listing.disposal_method.replace('_', ' ')}
                    </p>
                  </div>
                  {listing.location_description && (
                    <div className="col-span-2">
                      <span className="font-medium text-muted-foreground">{t('farmer.location')}:</span>
                      <p className="text-sm">{listing.location_description}</p>
                    </div>
                  )}
                  {listing.harvest_date && (
                    <div className="col-span-2">
                      <span className="font-medium text-muted-foreground">{t('farmer.harvestDate')}:</span>
                      <p className="text-sm">{new Date(listing.harvest_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    {t('farmer.view')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    {t('farmer.edit')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteListing(listing.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}