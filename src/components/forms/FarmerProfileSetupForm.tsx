import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CropMultiSelect } from './CropMultiSelect';
import { LandholdingInput } from './LandholdingInput';

interface FarmerProfileSetupFormProps {
  onSuccess: () => void;
}

export const FarmerProfileSetupForm = ({ onSuccess }: FarmerProfileSetupFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [panchayats, setPanchayats] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    farmer_name: profile?.full_name || '',
    village: '',
    farmer_phone: profile?.phone || '',
    land_area_acres: '',
    landholding_unit: 'acres',
    panchayat_id: '',
    crop_types: [] as string[],
    parent_name: '',
    upi_id: '',
    bank_account_number: '',
    bank_ifsc_code: ''
  });

  useEffect(() => {
    fetchPanchayats();
    
    // Check if panchayat was selected during signup
    const savedPanchayatId = localStorage.getItem('selected_panchayat_id');
    if (savedPanchayatId) {
      setFormData(prev => ({ ...prev, panchayat_id: savedPanchayatId }));
      localStorage.removeItem('selected_panchayat_id'); // Clean up after using
    }
  }, []);

  const fetchPanchayats = async () => {
    try {
      const { data, error } = await supabase
        .from('panchayats')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching panchayats:', error);
        toast({
          title: "Database Error",
          description: "Failed to load panchayats from database.",
          variant: "destructive"
        });
        setPanchayats([]);
        return;
      }

      setPanchayats(data || []);
      
      if (!data || data.length === 0) {
        console.log('No panchayats found in database');
      } else {
        console.log(`Found ${data.length} panchayats`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setPanchayats([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('farmers')
        .insert({
          profile_id: profile.id,
          farmer_name: formData.farmer_name,
          village: formData.village,
          farmer_phone: formData.farmer_phone,
          land_area_acres: parseFloat(formData.land_area_acres) || null,
          panchayat_id: formData.panchayat_id,
          crop_types: formData.crop_types,
          parent_name: formData.parent_name || null,
          upi_id: formData.upi_id || null,
          bank_account_number: formData.bank_account_number || null,
          bank_ifsc_code: formData.bank_ifsc_code || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your farmer profile has been created successfully!"
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
    
    return hasPaymentMethod && validBankDetails && formData.crop_types.length > 0 && panchayats.length > 0;
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
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
              placeholder="Enter your full name"
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
          <Label htmlFor="panchayat_id">Panchayat *</Label>
          {panchayats.length === 0 ? (
            <div className="space-y-3">
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="No panchayats available" />
                </SelectTrigger>
              </Select>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ No panchayats found. You need to:
                </p>
                <ol className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 ml-4 list-decimal">
                  <li>Create a panchayat account first, OR</li>
                  <li>Ask your panchayat admin to register their panchayat</li>
                </ol>
              </div>
            </div>
          ) : (
            <Select 
              value={formData.panchayat_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, panchayat_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your panchayat" />
              </SelectTrigger>
              <SelectContent>
                {panchayats.map(panchayat => (
                  <SelectItem key={panchayat.id} value={panchayat.id}>
                    {panchayat.name} - {panchayat.village}, {panchayat.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !isFormValid()}
      >
        {loading ? "Creating Profile..." : !isFormValid() ? 
          (panchayats.length === 0 ? "No Panchayats Available" : "Complete All Required Fields") : 
          "Complete Profile Setup"}
      </Button>
    </form>
  );
};