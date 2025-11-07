import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Plus, Minus, Wheat, MapPin } from 'lucide-react';
import { LocationPicker } from '@/components/LocationPicker';
import { useTranslatedText } from '@/lib/translationUtils';

// Import crop images  
import paddyResidue from '@/assets/crops/paddy-residue.jpg';
import wheatResidue from '@/assets/crops/wheat-residue.jpg';
import sugarcaneResidue from '@/assets/crops/sugarcane-residue.jpg';
import cottonResidue from '@/assets/crops/cotton-residue.jpg';
import maizeResidue from '@/assets/crops/maize-residue.jpg';
import sunflowerResidue from '@/assets/crops/sunflower-residue.jpg';
import huskResidue from '@/assets/crops/husk-residue.jpg';

interface ResidueItem {
  cropType: string;
  quantity: number;
  unit: string;
  earnings: number;
}

interface MarketplaceResidueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MarketplaceResidueForm = ({ onSuccess, onCancel }: MarketplaceResidueFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { translateFarmerProfile } = useTranslatedText();
  const [loading, setLoading] = useState(false);
  const [panchayat, setPanchayat] = useState<any>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [cart, setCart] = useState<ResidueItem[]>([]);

  // Predefined rates per kg for different crop residues
  const cropRates = {
    paddy: 3.5,
    wheat: 4.0,
    sugarcane: 2.5,
    cotton: 5.0,
    maize: 3.0,
    sunflower: 4.5,
    husk: 2.0
  };

  const cropOptions = [
    { value: 'paddy', label: 'Paddy', image: paddyResidue },
    { value: 'wheat', label: 'Wheat', image: wheatResidue },
    { value: 'sugarcane', label: 'Sugarcane', image: sugarcaneResidue },
    { value: 'cotton', label: 'Cotton', image: cottonResidue },
    { value: 'maize', label: 'Maize', image: maizeResidue },
    { value: 'sunflower', label: 'Sunflower', image: sunflowerResidue },
    { value: 'husk', label: 'Husk', image: huskResidue }
  ];

  const quantityUnits = [
    { value: 'kg', label: 'Kg', multiplier: 1 },
    { value: 'quintals', label: 'Quintals', multiplier: 100 },
    { value: 'tons', label: 'Tons', multiplier: 1000 }
  ];

  useEffect(() => {
    fetchPanchayatAndFarmers();
  }, [profile]);

  const fetchPanchayatAndFarmers = async () => {
    if (!profile) return;

    try {
      // For farmer role, fetch their own farmer record
      if (profile.role === 'farmer') {
        const { data: farmerData, error: farmerError } = await supabase
          .from('farmers')
          .select('*, panchayats(*)')
          .eq('profile_id', profile.id)
          .single();

        if (farmerError) {
          if (farmerError.code === 'PGRST116') {
            // No farmer record found - user needs to complete registration
            toast({
              title: "Farmer Profile Required",
              description: "Please complete your farmer registration first before creating listings.",
              variant: "destructive"
            });
            return;
          }
          console.error('Error fetching farmer:', farmerError);
          toast({
            title: "Error",
            description: "Failed to fetch farmer profile. Please try again.",
            variant: "destructive"
          });
          return;
        }

        if (!farmerData.panchayat_id) {
          toast({
            title: "Panchayat Required",
            description: "Your farmer profile needs to be associated with a panchayat first.",
            variant: "destructive"
          });
          return;
        }

        setPanchayat(farmerData.panchayats);
        setFarmers([farmerData]);
        setSelectedFarmerId(farmerData.id);
        return;
      }

      // For panchayat admin, fetch panchayat and all farmers
      const { data: panchayatData, error: panchayatError } = await supabase
        .from('panchayats')
        .select('*')
        .eq('admin_id', profile.id)
        .single();

      if (panchayatError) {
        if (panchayatError.code === 'PGRST116') {
          toast({
            title: "Panchayat Profile Required",
            description: "Please complete your panchayat registration first.",
            variant: "destructive"
          });
          return;
        }
        console.error('Error fetching panchayat:', panchayatError);
        toast({
          title: "Error",
          description: "Failed to fetch panchayat profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setPanchayat(panchayatData);

      // Fetch farmers
      const { data: farmersData, error: farmersError } = await supabase
        .from('farmers')
        .select('*')
        .eq('panchayat_id', panchayatData.id);

      if (farmersError) {
        console.error('Error fetching farmers:', farmersError);
        toast({
          title: "Error",
          description: "Failed to fetch farmers list. Please try again.",
          variant: "destructive"
        });
      } else {
        setFarmers(farmersData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addToCart = (cropType: string, quantity: number, unit: string) => {
    if (quantity <= 0) return;

    const rate = cropRates[cropType as keyof typeof cropRates] || 0;
    const unitMultiplier = quantityUnits.find(u => u.value === unit)?.multiplier || 1;
    const quantityInKg = quantity * unitMultiplier;
    const earnings = rate * quantityInKg;

    const existingItemIndex = cart.findIndex(item => item.cropType === cropType && item.unit === unit);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].earnings += earnings;
      setCart(updatedCart);
    } else {
      setCart([...cart, { cropType, quantity, unit, earnings }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    const updatedCart = [...cart];
    const item = updatedCart[index];
    const rate = cropRates[item.cropType as keyof typeof cropRates] || 0;
    const unitMultiplier = quantityUnits.find(u => u.value === item.unit)?.multiplier || 1;
    const quantityInKg = newQuantity * unitMultiplier;
    
    updatedCart[index] = {
      ...item,
      quantity: newQuantity,
      earnings: rate * quantityInKg
    };
    
    setCart(updatedCart);
  };

  const getTotalEarnings = () => {
    return cart.reduce((total, item) => total + item.earnings, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !panchayat || !selectedLocation?.address.trim() || cart.length === 0 || !selectedFarmerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including pickup location.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create listings for each cart item
      const insertPromises = cart.map(item => {
        const insertData = {
          farmer_id: selectedFarmerId,
          panchayat_id: panchayat.id,
          crop_type: item.cropType as Database['public']['Enums']['crop_type'],
          disposal_method: 'sell_for_profit' as Database['public']['Enums']['disposal_method'],
          quantity_tons: item.unit === 'tons' ? item.quantity : 
                        item.unit === 'quintals' ? item.quantity / 10 : 
                        item.quantity / 1000,
          price_per_ton: (cropRates[item.cropType as keyof typeof cropRates] || 0) * 1000,
          location_description: selectedLocation.address,
          latitude: null, // We're not using coordinates for now
          longitude: null, // We're not using coordinates for now
          status: 'available' as Database['public']['Enums']['residue_status']
        };
        
        return supabase.from('crop_residue_listings').insert(insertData);
      });

      const results = await Promise.all(insertPromises);
      
      // Check if any insertion failed
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to create some listings');
      }

      toast({
        title: "Success",
        description: `Created ${cart.length} crop residue listing${cart.length > 1 ? 's' : ''} successfully!`
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  
  // Show message if user doesn't have proper setup
  if (!panchayat && !loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Setup Required</CardTitle>
          <CardDescription className="text-center">
            {profile?.role === 'farmer' 
              ? "You need to complete your farmer registration before creating listings."
              : "You need to complete your panchayat registration before managing listings."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onCancel} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">{t('analytics.cropResidueMarketplace')}</CardTitle>
              <CardDescription>
                {t('analytics.selectCropResidues')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Farmer Selection for Panchayat Admin */}
            {profile?.role === 'panchayat_admin' && (
              <div>
                <Label htmlFor="farmer_id" className="text-base font-medium">Select Farmer *</Label>
                <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map(farmer => {
                      const translatedProfile = translateFarmerProfile(
                        farmer.farmer_name,
                        farmer.village,
                        undefined,
                        undefined,
                        undefined
                      );
                      return (
                        <SelectItem key={farmer.id} value={farmer.id}>
                          {translatedProfile.name} - {translatedProfile.village}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Crop Selection Grid */}
            <div>
              <Label className="text-base font-medium mb-4 block">{t('analytics.availableCropResidues')}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropOptions.map(crop => (
                  <CropCard
                    key={crop.value}
                    crop={crop}
                    rate={cropRates[crop.value as keyof typeof cropRates]}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>

            {/* Pickup Location - Only show after items are added */}
            {cart.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Pickup Location *
                </Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter your complete address (Street, Locality, Town/City, State, Pincode)"
                    value={selectedLocation?.address || ''}
                    onChange={(e) => setSelectedLocation({
                      lat: 0,
                      lng: 0,
                      address: e.target.value
                    })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: 123 Main Street, Central Market, Mumbai, Maharashtra, 400001
                  </p>
                </div>
              </div>
            )}

            {/* Selling List */}
            {cart.length > 0 && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-300">Items to List for Selling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium capitalize">{item.cropType}</span>
                        <div className="text-sm text-muted-foreground">
                          ₹{cropRates[item.cropType as keyof typeof cropRates]}/kg
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-16 text-center">
                          {item.quantity} {item.unit}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <div className="w-24 text-right font-medium">
                          ₹{item.earnings.toFixed(2)}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-lg font-bold text-green-700 dark:text-green-300">
                      <span>Total Earnings:</span>
                      <span>₹{getTotalEarnings().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={loading || !selectedLocation?.address.trim() || cart.length === 0 || !selectedFarmerId}
              >
                {loading ? "Creating Listings..." : `Create ${cart.length} Listing${cart.length !== 1 ? 's' : ''} - Earn ₹${getTotalEarnings().toFixed(0)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Crop Card Component
interface CropCardProps {
  crop: { value: string; label: string; image: string };
  rate: number;
  onAddToCart: (cropType: string, quantity: number, unit: string) => void;
}

const CropCard = ({ crop, rate, onAddToCart }: CropCardProps) => {
  const { t } = useTranslation();
  const { translateCropName } = useTranslatedText();
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const quantityUnits = [
    { value: 'kg', label: t('analytics.kg'), multiplier: 1 },
    { value: 'quintals', label: t('analytics.quintals'), multiplier: 100 },
    { value: 'tons', label: t('analytics.tons'), multiplier: 1000 }
  ];

  const getEarnings = () => {
    if (!quantity || !unit) return 0;
    const unitMultiplier = quantityUnits.find(u => u.value === unit)?.multiplier || 1;
    return rate * parseFloat(quantity) * unitMultiplier;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <img 
              src={crop.image} 
              alt={`${crop.label} residue`}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <Badge className="absolute top-2 right-2 bg-green-600 text-white">
              ₹{rate}/kg
            </Badge>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{translateCropName(crop.label)}</h3>
            <p className="text-sm text-muted-foreground">{t('analytics.cropResidueForSale')}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">{t('analytics.quantityAndUnit')}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0.1"
                step="0.1"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1"
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder={t('analytics.unit')} />
                </SelectTrigger>
                <SelectContent>
                  {quantityUnits.map(u => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {quantity && unit && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                Earnings: ₹{getEarnings().toFixed(2)}
              </div>
            )}
            
            <Button
              type="button"
              size="sm"
              className="w-full"
              disabled={!quantity || !unit || parseFloat(quantity) <= 0}
              onClick={() => onAddToCart(crop.value, parseFloat(quantity), unit)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {t('analytics.listForSelling')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};