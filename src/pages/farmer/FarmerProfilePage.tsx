import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Phone, Mail, Calendar, Shield, Edit, Save, X, CreditCard, Leaf } from 'lucide-react';
import { CropMultiSelect } from '@/components/forms/CropMultiSelect';

export default function FarmerProfilePage() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [farmerData, setFarmerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    farmer_name: '',
    farmer_phone: '',
    village: '',
    land_area_acres: '',
    crop_types: [] as string[],
    parent_name: '',
    aadhar_number: '',
    upi_id: '',
    bank_account_number: '',
    bank_ifsc_code: ''
  });

  useEffect(() => {
    fetchFarmerProfile();
  }, [profile]);

  const fetchFarmerProfile = async () => {
    if (!profile) return;

    try {
      const { data: farmerProfile, error } = await supabase
        .from('farmers')
        .select(`
          *,
          panchayats (
            name,
            village,
            district,
            state,
            pincode
          )
        `)
        .eq('profile_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching farmer profile:', error);
        return;
      }

      if (farmerProfile) {
        setFarmerData(farmerProfile);
        setFormData({
          farmer_name: farmerProfile.farmer_name || '',
          farmer_phone: farmerProfile.farmer_phone || '',
          village: farmerProfile.village || '',
          land_area_acres: farmerProfile.land_area_acres?.toString() || '',
          crop_types: farmerProfile.crop_types || [],
          parent_name: farmerProfile.parent_name || '',
          aadhar_number: farmerProfile.aadhar_number || '',
          upi_id: farmerProfile.upi_id || '',
          bank_account_number: farmerProfile.bank_account_number || '',
          bank_ifsc_code: farmerProfile.bank_ifsc_code || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('common.error'),
        description: t('profilePage.failedToLoadProfileData'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!farmerData) return;

    try {
      const updateData = {
        farmer_name: formData.farmer_name,
        farmer_phone: formData.farmer_phone,
        village: formData.village,
        land_area_acres: formData.land_area_acres ? parseFloat(formData.land_area_acres) : null,
        crop_types: formData.crop_types,
        parent_name: formData.parent_name || null,
        aadhar_number: formData.aadhar_number || null,
        upi_id: formData.upi_id || null,
        bank_account_number: formData.bank_account_number || null,
        bank_ifsc_code: formData.bank_ifsc_code || null
      };

      const { error } = await supabase
        .from('farmers')
        .update(updateData)
        .eq('id', farmerData.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('profilePage.profileUpdatedSuccessfully')
      });
      
      setEditing(false);
      fetchFarmerProfile();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to original values
    if (farmerData) {
      setFormData({
        farmer_name: farmerData.farmer_name || '',
        farmer_phone: farmerData.farmer_phone || '',
        village: farmerData.village || '',
        land_area_acres: farmerData.land_area_acres?.toString() || '',
        crop_types: farmerData.crop_types || [],
        parent_name: farmerData.parent_name || '',
        aadhar_number: farmerData.aadhar_number || '',
        upi_id: farmerData.upi_id || '',
        bank_account_number: farmerData.bank_account_number || '',
        bank_ifsc_code: farmerData.bank_ifsc_code || ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
        <div className="bg-card p-8 rounded-lg border shadow-sm">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">{t('farmer.verificationRequired')}</h2>
          
          <div className="space-y-4 text-left">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="font-semibold text-foreground mb-2">{t('farmer.verificationSteps')}</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>{t('farmer.verificationStep1')}</li>
                <li>{t('farmer.verificationStep2')}</li>
                <li>{t('farmer.verificationStep3')}</li>
                <li>{t('farmer.verificationStep4')}</li>
              </ol>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <p className="text-sm text-foreground">
                <strong>{t('common.important')}:</strong> {t('farmer.verificationImportant')}
              </p>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-muted-foreground text-sm">
                {t('profilePage.questionsContactSupport')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('farmer.myProfile')}</h1>
          <p className="text-muted-foreground">{t('farmer.personalInformation')}</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                {t('farmer.cancel')}
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {t('farmer.saveChanges')}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('farmer.editProfile')}
            </Button>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{t('profilePage.verificationStatus')}</CardTitle>
                <CardDescription>{t('profilePage.accountVerificationStatus')}</CardDescription>
              </div>
            </div>
            <Badge variant={farmerData.verification_status === 'verified' ? 'default' : 'outline'}>
              {farmerData.verification_status === 'verified' ? t('profilePage.verified') : t('profilePage.pending')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {farmerData.verification_status === 'verified' ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                {t('profilePage.profileVerified')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-warning/10 p-4 rounded-md border border-warning/20">
                <p className="text-sm text-foreground font-medium mb-2">
                  {t('profilePage.accountVerificationRequired')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('profilePage.profilePendingVerification')}
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {t('profilePage.stepsToCompleteVerification')}
                </h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>{t('profilePage.visitPanchayatOffice')}</li>
                  <li>{t('profilePage.bringOriginalAadhar')}</li>
                  <li>{t('profilePage.meetPanchayatAdmin')}</li>
                  <li>{t('profilePage.provideLandDocuments')}</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t('profilePage.personalInformation')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="farmer_name">{t('profilePage.fullName')}</Label>
              <Input
                id="farmer_name"
                name="farmer_name"
                value={formData.farmer_name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <Label htmlFor="parent_name">{t('profilePage.fatherMotherName')}</Label>
              <Input
                id="parent_name"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <Label htmlFor="farmer_phone">{t('profilePage.phoneNumber')}</Label>
              <Input
                id="farmer_phone"
                name="farmer_phone"
                value={formData.farmer_phone}
                onChange={handleChange}
                disabled={!editing}
                type="tel"
              />
            </div>
            <div>
              <Label htmlFor="aadhar_number">{t('profilePage.aadharNumber')}</Label>
              <Input
                id="aadhar_number"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                disabled={!editing}
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('profilePage.forVerificationPurposes')}
              </p>
            </div>
            <div>
              <Label>{t('profilePage.emailAddress')}</Label>
              <Input
                value={user?.email || ''}
                disabled
                type="email"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('profilePage.emailCannotChange')}
              </p>
            </div>
            <div>
              <Label>{t('profilePage.coordinates')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={farmerData.latitude?.toFixed(6) || t('profilePage.notSet')}
                  disabled
                  placeholder={t('profilePage.latitude')}
                />
                <Input
                  value={farmerData.longitude?.toFixed(6) || t('profilePage.notSet')}
                  disabled
                  placeholder={t('profilePage.longitude')}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('farmer.locationCoordinates')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Panchayat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{t('profilePage.locationPanchayat')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="village">{t('profilePage.village')}</Label>
              <Input
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <Label>{t('profilePage.panchayat')}</Label>
              <Input
                value={farmerData.panchayats?.name || t('profilePage.notAssigned')}
                disabled
              />
            </div>
            <div>
              <Label>{t('profilePage.district')}</Label>
              <Input
                value={farmerData.panchayats?.district || 'N/A'}
                disabled
              />
            </div>
            <div>
              <Label>{t('profilePage.state')}</Label>
              <Input
                value={farmerData.panchayats?.state || 'N/A'}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Farming Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span>{t('profilePage.farmingInformation')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <CropMultiSelect 
                selectedCrops={formData.crop_types}
                onChange={handleCropChange}
                label={t('profilePage.cropsYouGrow')}
              />
            </div>
            <div>
              <Label htmlFor="land_area_acres">{t('profilePage.landAreaAcres')}</Label>
              <Input
                id="land_area_acres"
                name="land_area_acres"
                value={formData.land_area_acres}
                onChange={handleChange}
                disabled={!editing}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <Label>{t('profilePage.farmLocation')}</Label>
              <div className="text-sm text-muted-foreground">
                {t('profilePage.latitude')}: {farmerData.latitude?.toFixed(6) || t('profilePage.notSet')}<br />
                {t('profilePage.longitude')}: {farmerData.longitude?.toFixed(6) || t('profilePage.notSet')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('profilePage.contactPanchayatLocation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{t('profilePage.paymentInformation')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="upi_id">{t('profilePage.upiId')}</Label>
              <Input
                id="upi_id"
                name="upi_id"
                value={formData.upi_id}
                onChange={handleChange}
                disabled={!editing}
                placeholder="yourname@paytm"
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">OR</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_account_number">{t('profilePage.bankAccountNumber')}</Label>
                <Input
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="bank_ifsc_code">{t('profilePage.ifscCode')}</Label>
                <Input
                  id="bank_ifsc_code"
                  name="bank_ifsc_code"
                  value={formData.bank_ifsc_code}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>
            {!formData.upi_id && !formData.bank_account_number && (
              <div className="bg-warning/10 p-3 rounded-md border border-warning/20">
                <p className="text-sm text-foreground font-medium">
                  {t('profilePage.noPaymentMethodConfigured')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('profilePage.addUpiOrBankDetails')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Stats - Updated */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profilePage.profileStatistics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {new Date(farmerData.created_at).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">{t('profilePage.memberSince')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {farmerData.verification_status === 'verified' ? '✓' : '⏱'}
              </div>
              <p className="text-sm text-muted-foreground">{t('profilePage.verification')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {farmerData.crop_types?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">{t('profilePage.crops')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {farmerData.land_area_acres || 0}
              </div>
              <p className="text-sm text-muted-foreground">{t('profilePage.acres')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(farmerData.upi_id || farmerData.bank_account_number) ? '✓' : '✗'}
              </div>
              <p className="text-sm text-muted-foreground">{t('profilePage.paymentSetup')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}