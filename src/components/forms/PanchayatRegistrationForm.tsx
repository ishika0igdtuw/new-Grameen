import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Building, Shield, Users, TreePine } from 'lucide-react';

interface PanchayatRegistrationFormProps {
  onSuccess: () => void;
}

export const PanchayatRegistrationForm = ({ onSuccess }: PanchayatRegistrationFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: '',
    state: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Panchayat form submission started');
    console.log('Profile:', profile);
    console.log('Form data:', formData);
    
    if (!profile) {
      console.log('No profile found, aborting submission');
      return;
    }

    setLoading(true);
    try {
      const insertData = {
        name: formData.name,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        admin_id: profile.id
      };
      
      console.log('Inserting panchayat data:', insertData);
      
      const { data, error } = await supabase
        .from('panchayats')
        .insert(insertData)
        .select();

      console.log('Supabase response - data:', data, 'error:', error);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Panchayat registered successfully!"
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Panchayat registration error:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4 flex items-center justify-center">
      <Card className="max-w-3xl w-full mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0">
        <CardHeader className="text-center pb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-teal-500/10"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400/20 rounded-full translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            {/* Icon Group */}
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="p-2 bg-gradient-to-r from-teal-500 to-green-600 rounded-full shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-700 via-blue-700 to-teal-700 bg-clip-text text-transparent mb-3">
              पंचायत पंजीकरण
            </CardTitle>
            <CardTitle className="text-2xl font-semibold text-gray-700 mb-4">
              Panchayat Registration
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Complete your panchayat registration to empower farmers, manage crop residue effectively, 
              and contribute to sustainable agriculture in your region
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                <TreePine className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-800">Eco-Friendly Residue Management</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Farmer Community Support</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
                <Shield className="h-6 w-6 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Verified Administration</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <span>Panchayat Name *</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Gram Panchayat Rampur"
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Village Name *</span>
                  </Label>
                  <Input
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="e.g., Rampur"
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <span>District *</span>
                  </Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Muzaffarnagar"
                    required
                    className="h-12 border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    <span>State *</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Uttar Pradesh"
                    required
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 hover:from-green-700 hover:via-blue-700 hover:to-teal-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Registering Panchayat...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Register Panchayat</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};