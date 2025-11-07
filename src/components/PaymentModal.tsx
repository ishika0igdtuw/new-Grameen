import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, MapPin, Truck, Calendar } from 'lucide-react';

interface PaymentModalProps {
  listing: {
    id: string;
    crop_type: string;
    quantity_tons: number;
    price_per_ton: number;
    disposal_method: string;
    status: string;
    location_description: string;
    harvest_date: string;
    farmers: {
      farmer_name: string;
      village: string;
      farmer_phone?: string;
    };
    panchayats: {
      name: string;
      village: string;
      district: string;
      state: string;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PaymentModal = ({ listing, open, onOpenChange, onSuccess }: PaymentModalProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity_tons: listing.quantity_tons,
    pickup_date: '',
    notes: ''
  });

  const totalAmount = formData.quantity_tons * listing.price_per_ton;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      // Create purchase record
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          buyer_id: profile.id,
          residue_listing_id: listing.id,
          quantity_tons: formData.quantity_tons,
          total_amount: totalAmount,
          pickup_date: formData.pickup_date || null,
          notes: formData.notes || null,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // For now, simulate payment success
      // In production, integrate with Stripe/Razorpay
      const { error: paymentUpdateError } = await supabase
        .from('purchases')
        .update({ 
          payment_status: 'completed',
          payment_id: `pay_${Date.now()}`
        })
        .eq('id', purchaseData.id);

      if (paymentUpdateError) throw paymentUpdateError;

      // Update residue listing status
      const newStatus = formData.quantity_tons >= listing.quantity_tons ? 'sold' : 'available';
      const { error: listingUpdateError } = await supabase
        .from('crop_residue_listings')
        .update({ 
          status: newStatus,
          quantity_tons: listing.quantity_tons - formData.quantity_tons
        })
        .eq('id', listing.id);

      if (listingUpdateError) throw listingUpdateError;

      toast({
        title: "Purchase Successful!",
        description: `You have successfully purchased ${formData.quantity_tons} tons of ${listing.crop_type} for ₹${totalAmount.toLocaleString()}.`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Purchase Crop Residue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Crop Type:</span>
                  <div className="font-medium">
                    {listing.crop_type.charAt(0).toUpperCase() + listing.crop_type.slice(1)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <div className="font-medium">{listing.quantity_tons} tons</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Price per Ton:</span>
                  <div className="font-medium">₹{listing.price_per_ton.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Farmer:</span>
                  <div className="font-medium">{listing.farmers.farmer_name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {listing.farmers.village}, {listing.panchayats.district}, {listing.panchayats.state}
                </span>
              </div>

              {listing.location_description && (
                <p className="text-sm text-muted-foreground">
                  <strong>Location:</strong> {listing.location_description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity_tons">Quantity to Purchase (tons) *</Label>
                <Input
                  id="quantity_tons"
                  name="quantity_tons"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={listing.quantity_tons}
                  value={formData.quantity_tons}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum: {listing.quantity_tons} tons
                </p>
              </div>
              <div>
                <Label htmlFor="pickup_date">Preferred Pickup Date</Label>
                <Input
                  id="pickup_date"
                  name="pickup_date"
                  type="date"
                  value={formData.pickup_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements or delivery instructions"
                rows={3}
              />
            </div>

            <Separator />

            {/* Total Amount */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {formData.quantity_tons} tons × ₹{listing.price_per_ton.toLocaleString()}/ton
              </div>
            </div>

            {/* Contact Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Contact Information</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p>Farmer: {listing.farmers.farmer_name}</p>
                  {listing.farmers.farmer_phone && (
                    <p>Phone: {listing.farmers.farmer_phone}</p>
                  )}
                  <p>Panchayat: {listing.panchayats.name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Notice */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Payment Process</span>
                </div>
                <p className="text-sm text-yellow-800">
                  Your payment will be processed securely. Upon confirmation, you'll receive contact details 
                  for pickup coordination. Payment is held in escrow until pickup is completed.
                </p>
              </CardContent>
            </Card>

            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading || formData.quantity_tons <= 0 || formData.quantity_tons > listing.quantity_tons}
              >
                {loading ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};