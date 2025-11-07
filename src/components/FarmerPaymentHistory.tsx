import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Wheat, TrendingUp } from 'lucide-react';

export const FarmerPaymentHistory = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [paymentDistributions, setPaymentDistributions] = useState<any[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, [profile]);

  const fetchPaymentHistory = async () => {
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

      // Fetch payment distributions
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('farmer_payment_distributions')
        .select(`
          *,
          bulk_purchases!inner(
            total_quantity_tons,
            avg_price_per_ton,
            created_at,
            panchayats!inner(name, village)
          ),
          crop_residue_listings!inner(
            crop_type,
            disposal_method,
            harvest_date
          )
        `)
        .eq('farmer_id', farmerData.id)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      } else {
        setPaymentDistributions(paymentsData || []);
      }

    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load payment history',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const totalEarnings = paymentDistributions
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);

  const pendingEarnings = paymentDistributions
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.payment_amount), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Payment History
        </h1>
        <p className="text-muted-foreground">
          Track your earnings from crop residue sales
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{pendingEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {paymentDistributions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg per Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ₹{paymentDistributions.length > 0 ? 
                Math.round((totalEarnings + pendingEarnings) / paymentDistributions.length).toLocaleString() : 
                '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            Your earnings from proportional payments when bulk purchases are made
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentDistributions.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment history yet</h3>
              <p className="text-muted-foreground">
                Your earnings will appear here when buyers purchase your crop residues
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentDistributions.map((payment: any) => (
                <Card key={payment.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold capitalize">
                          {payment.crop_residue_listings.crop_type.replace('_', ' ')}
                        </h4>
                        <Badge variant={getPaymentStatusColor(payment.payment_status)}>
                          {payment.payment_status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{parseFloat(payment.payment_amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Your Quantity:</span>
                        <p className="font-medium">{payment.quantity_tons} tons</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Your Price:</span>
                        <p className="font-medium">₹{parseFloat(payment.price_per_ton).toLocaleString()}/ton</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bulk Purchase:</span>
                        <p className="font-medium">
                          {payment.bulk_purchases.total_quantity_tons} tons total
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">
                          {payment.bulk_purchases.panchayats.village}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Purchase Date: {new Date(payment.bulk_purchases.created_at).toLocaleDateString()}
                        </div>
                        {payment.crop_residue_listings.harvest_date && (
                          <div>
                            Harvest Date: {new Date(payment.crop_residue_listings.harvest_date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="capitalize">
                          Method: {payment.crop_residue_listings.disposal_method.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};