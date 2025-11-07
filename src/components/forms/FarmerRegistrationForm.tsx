import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users } from 'lucide-react';
import { CropMultiSelect } from './CropMultiSelect';
import { LandholdingInput } from './LandholdingInput';

interface FarmerRegistrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const FarmerRegistrationForm = ({ onSuccess, onCancel }: FarmerRegistrationFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [panchayat, setPanchayat] = useState<any>(null);
  const [formData, setFormData] = useState({
    farmer_name: '',
    village: '',
    farmer_phone: '',
    land_area_acres: '',
    landholding_unit: 'acres',
    crop_types: [] as string[],
    parent_name: '',
    aadhar_number: '',
    upi_id: '',
    bank_account_number: '',
    bank_ifsc_code: ''
  });

  useEffect(() => {
    fetchPanchayat();
  }, [profile]);

  const fetchPanchayat = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('panchayats')
      .select('*')
      .eq('admin_id', profile.id)
      .single();

    if (error) {
      console.error('Error fetching panchayat:', error);
    } else {
      setPanchayat(data);
      setFormData(prev => ({ ...prev, village: data.village }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !panchayat) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('farmers')
        .insert({
          farmer_name: formData.farmer_name,
          village: formData.village,
          farmer_phone: formData.farmer_phone,
          land_area_acres: parseFloat(formData.land_area_acres) || null,
          crop_types: formData.crop_types,
          parent_name: formData.parent_name || null,
          aadhar_number: formData.aadhar_number || null,
          upi_id: formData.upi_id || null,
          bank_account_number: formData.bank_account_number || null,
          bank_ifsc_code: formData.bank_ifsc_code || null,
          panchayat_id: panchayat.id
        });

      if (error) throw error;

      // The farmer registration creates a pending entry that panchayat admin can see
      // in their dashboard for verification

      toast({
        title: "Success",
        description: "Farmer registered successfully! The farmer will appear in your dashboard with pending verification status."
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCropChange = (crops: string[]) => {
    setFormData(prev => ({
      ...prev,
      crop_types: crops
    }));
  };

  // Validation functions
  const validateBankAccount = (accountNumber: string) => {
    // Bank account should be 9-18 digits
    const cleaned = accountNumber.replace(/\s/g, '');
    return /^\d{9,18}$/.test(cleaned);
  };

  const validateIFSC = (ifsc: string) => {
    // IFSC format: 4 letters + 0 + 6 digits (total 11 characters)
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  };

  const isFormValid = () => {
    const hasPaymentMethod = formData.upi_id.trim() || 
      (formData.bank_account_number.trim() && formData.bank_ifsc_code.trim());
    
    const validBankDetails = !formData.bank_account_number.trim() || 
      (validateBankAccount(formData.bank_account_number) && validateIFSC(formData.bank_ifsc_code));
    
    return hasPaymentMethod && validBankDetails && formData.crop_types.length > 0;
  };


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Register New Farmer</CardTitle>
            <CardDescription>
              Add a farmer to your panchayat database
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmer_name">Full Name *</Label>
                <Input
                  id="farmer_name"
                  name="farmer_name"
                  value={formData.farmer_name}
                  onChange={handleChange}
                  placeholder="Enter farmer's full name"
                  required
                />
              </div>
                <div>
                  <Label htmlFor="parent_name">Father's/Mother's Name</Label>
                  <Input
                    id="parent_name"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleChange}
                    placeholder="Enter parent's name"
                  />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmer_phone">Mobile Number *</Label>
                <Input
                  id="farmer_phone"
                  name="farmer_phone"
                  value={formData.farmer_phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  type="tel"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">For SMS updates & confirmations</p>
              </div>
              <div>
                <Label htmlFor="village">Village *</Label>
                <Input
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Enter village name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="aadhar_number">Aadhar Number (Optional)</Label>
              <Input
                id="aadhar_number"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar number"
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground mt-1">For verification purposes</p>
            </div>
          </div>

          {/* Farming Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Farming Details</h3>
            
            <CropMultiSelect 
              selectedCrops={formData.crop_types}
              onChange={handleCropChange}
            />

            <LandholdingInput
              value={formData.land_area_acres}
              unit={formData.landholding_unit}
              onValueChange={(value) => setFormData(prev => ({ ...prev, land_area_acres: value }))}
              onUnitChange={(unit) => setFormData(prev => ({ ...prev, landholding_unit: unit }))}
            />
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Payment Information *</h3>
            <p className="text-sm text-muted-foreground">Choose one payment method for receiving payments</p>
            
            <div>
              <Label htmlFor="upi_id">UPI ID</Label>
              <Input
                id="upi_id"
                name="upi_id"
                value={formData.upi_id}
                onChange={handleChange}
                placeholder="yourname@paytm / yourname@phonepe"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_account_number">Bank Account Number</Label>
                <Input
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  placeholder="9-18 digit bank account number"
                  maxLength={18}
                />
                {formData.bank_account_number && !validateBankAccount(formData.bank_account_number) && (
                  <p className="text-xs text-destructive mt-1">Must be 9-18 digits only</p>
                )}
              </div>
              <div>
                <Label htmlFor="bank_ifsc_code">IFSC Code</Label>
                <Input
                  id="bank_ifsc_code"
                  name="bank_ifsc_code"
                  value={formData.bank_ifsc_code}
                  onChange={handleChange}
                  placeholder="ABCD0123456"
                  maxLength={11}
                  style={{ textTransform: 'uppercase' }}
                />
                {formData.bank_ifsc_code && !validateIFSC(formData.bank_ifsc_code) && (
                  <p className="text-xs text-destructive mt-1">Format: 4 letters + 0 + 6 digits (e.g. SBIN0123456)</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || !isFormValid()}
            >
              {loading ? "Registering..." : !isFormValid() ? "Complete All Required Fields" : "Register Farmer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};