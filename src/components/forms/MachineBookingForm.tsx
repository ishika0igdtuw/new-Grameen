import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tractor, Calendar } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

interface MachineBookingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MachineBookingForm = ({ onSuccess, onCancel }: MachineBookingFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: '',
    duration_hours: '',
    duration_days: '',
    pricing_type: 'hourly', // 'hourly' or 'daily'
    location_description: '',
    notes: ''
  });
  
  const [calculatedCost, setCalculatedCost] = useState(0);
  
  // Standard rates for farm machinery
  const hourlyRate = 800; // ₹800 per hour
  const dailyRate = 5000; // ₹5000 per day

  // Calculate cost whenever duration or pricing type changes
  useEffect(() => {
    if (formData.pricing_type === 'hourly' && formData.duration_hours) {
      setCalculatedCost(parseInt(formData.duration_hours) * hourlyRate);
    } else if (formData.pricing_type === 'daily' && formData.duration_days) {
      setCalculatedCost(parseInt(formData.duration_days) * dailyRate);
    } else {
      setCalculatedCost(0);
    }
  }, [formData.duration_hours, formData.duration_days, formData.pricing_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      // First get farmer record
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*, panchayats(*)')
        .eq('profile_id', profile.id)
        .single();

      if (farmerError) throw farmerError;

      const duration = formData.pricing_type === 'hourly' 
        ? parseInt(formData.duration_hours) 
        : parseInt(formData.duration_days) * 8; // Convert days to hours

      const insertData = {
        farmer_id: farmerData.id,
        panchayat_id: farmerData.panchayat_id,
        machine_type: 'combine_harvester' as Database['public']['Enums']['machine_type'], // Default machine type
        booking_date: formData.booking_date,
        duration_hours: duration,
        cost: calculatedCost,
        status: 'pending' as Database['public']['Enums']['booking_status'],
        notes: formData.notes || null
      };

      const { error } = await supabase
        .from('machine_bookings')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Machine booking request submitted successfully!"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePricingTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      pricing_type: value,
      duration_hours: '',
      duration_days: ''
    }));
    setCalculatedCost(0);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Tractor className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Book Farm Machine</CardTitle>
            <CardDescription>
              Get farm machinery for crop residue management - ₹{hourlyRate}/hour or ₹{dailyRate}/day
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pricing Type Selection */}
          <div>
            <Label>Pricing Type *</Label>
            <Select 
              value={formData.pricing_type} 
              onValueChange={handlePricingTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly (₹{hourlyRate}/hour) - 6 AM to 6 PM</SelectItem>
                <SelectItem value="daily">Daily (₹{dailyRate}/day) - 8 hours work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="booking_date">Booking Date *</Label>
              <Input
                id="booking_date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            {formData.pricing_type === 'hourly' ? (
              <div>
                <Label htmlFor="duration_hours">Duration (Hours) * <span className="text-sm text-muted-foreground">(6 AM - 6 PM)</span></Label>
                <Input
                  id="duration_hours"
                  name="duration_hours"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  placeholder="Enter hours (e.g., 8)"
                  type="number"
                  min="1"
                  max="12"
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="duration_days">Duration (Days) * <span className="text-sm text-muted-foreground">(8 hours per day)</span></Label>
                <Input
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  placeholder="Enter days (e.g., 2)"
                  type="number"
                  min="1"
                  max="30"
                  required
                />
              </div>
            )}
          </div>

          {/* Cost Display */}
          {calculatedCost > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-primary">Total Cost:</span>
                <span className="text-2xl font-bold text-primary">₹{calculatedCost.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.pricing_type === 'hourly' 
                  ? `${formData.duration_hours} hours × ₹${hourlyRate}/hour`
                  : `${formData.duration_days} days × ₹${dailyRate}/day`
                }
              </p>
            </div>
          )}


          <div>
            <Label htmlFor="location_description">Location Description</Label>
            <Input
              id="location_description"
              name="location_description"
              value={formData.location_description}
              onChange={handleChange}
              placeholder="e.g., Near village center, Plot number"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional requirements or information"
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || calculatedCost === 0}>
              {loading ? "Creating Request..." : `Create Request (₹${calculatedCost.toLocaleString()})`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};