import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database, Settings } from 'lucide-react';

export const DummyDataSetup = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const setupDummyData = async () => {
    setLoading(true);
    try {
      // First, let's check if panchayats already exist
      const { data: existingPanchayats, error: checkError } = await supabase
        .from('panchayats')
        .select('*');
      
      console.log('Existing panchayats check:', existingPanchayats, 'error:', checkError);

      if (existingPanchayats && existingPanchayats.length > 0) {
        toast({
          title: "Test Data Already Exists! ✅",
          description: "Panchayats are already available for selection"
        });
        setIsOpen(false);
        setLoading(false);
        return;
      }

      // Create panchayats with current user as admin for testing
      const { data: { user } } = await supabase.auth.getUser();
      const adminId = user?.id || '00000000-0000-0000-0000-000000000000';

      const panchayatsToCreate = [
        {
          admin_id: adminId,
          name: 'Gram Panchayat Rampur',
          village: 'Rampur',
          district: 'Muzaffarnagar', 
          state: 'Uttar Pradesh'
        },
        {
          admin_id: adminId,
          name: 'Gram Panchayat Sultanpur',
          village: 'Sultanpur',
          district: 'Meerut',
          state: 'Uttar Pradesh'
        },
        {
          admin_id: adminId, 
          name: 'Gram Panchayat Khatauli',
          village: 'Khatauli',
          district: 'Muzaffarnagar',
          state: 'Uttar Pradesh'
        }
      ];

      console.log('Creating panchayats with admin_id:', adminId);
      
      const { data: panchayatData, error: panchayatError } = await supabase
        .from('panchayats')
        .insert(panchayatsToCreate)
        .select();

      if (panchayatError) {
        console.error('Panchayat creation error:', panchayatError);
        throw new Error(`Failed to create panchayats: ${panchayatError.message}`);
      }

      console.log('Panchayats created successfully:', panchayatData);

      toast({
        title: "Test Panchayats Created! 🏛️",
        description: "Now you can select from Rampur, Sultanpur, and Khatauli panchayats during farmer signup"
      });
      
      // Refresh the page to reload panchayat data
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error setting up dummy data:', error);
      toast({
        title: "Error",
        description: `Failed to create panchayats: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
        size="sm"
      >
        <Database className="h-4 w-4 mr-2" />
        Setup Test Data
      </Button>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Test Data Setup</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
        <CardDescription className="text-xs">
          Create sample panchayats for farmer registration
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Creates sample panchayats:
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Gram Panchayat Rampur</li>
              <li>Gram Panchayat Sultanpur</li>
              <li>Gram Panchayat Khatauli</li>
            </ul>
          </div>
          <Button 
            onClick={setupDummyData} 
            disabled={loading} 
            className="w-full"
            size="sm"
          >
            {loading ? "Creating Panchayats..." : "Create Sample Panchayats"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};