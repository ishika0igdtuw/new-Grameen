import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { DollarSign, Search, TrendingUp, Calendar, Receipt } from 'lucide-react';

interface PaymentRecord {
  id: string;
  amount: number;
  payment_type: 'sale' | 'subsidy' | 'free_pickup';
  status: 'pending' | 'completed' | 'failed';
  transaction_date: string;
  crop_type: string;
  quantity_tons: number;
  buyer_name?: string;
  reference_number?: string;
  notes?: string;
}

export default function PaymentRecordsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  useEffect(() => {
    fetchPaymentRecords();
  }, [profile]);

  useEffect(() => {
    // Filter payments based on search query
    const filtered = payments.filter(payment => 
      payment.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.buyer_name && payment.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPayments(filtered);
  }, [payments, searchQuery]);

  const fetchPaymentRecords = async () => {
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

      // For now, we'll simulate payment records based on sold residue listings
      // In a real implementation, you'd have a payments table
      const { data: soldListings, error: listingsError } = await supabase
        .from('crop_residue_listings')
        .select('*')
        .eq('farmer_id', farmerProfile.id)
        .eq('status', 'sold')
        .order('updated_at', { ascending: false });

      if (listingsError) {
        console.error('Error fetching payment records:', listingsError);
        toast({
          title: "Error",
          description: "Failed to load payment records",
          variant: "destructive"
        });
      } else {
        // Convert sold listings to payment records
        const paymentRecords: PaymentRecord[] = (soldListings || []).map(listing => ({
          id: listing.id,
          amount: listing.price_per_ton * listing.quantity_tons,
          payment_type: listing.disposal_method === 'sell_for_profit' ? 'sale' : 
                       listing.disposal_method === 'free_pickup' ? 'free_pickup' : 'sale',
          status: 'completed',
          transaction_date: listing.updated_at,
          crop_type: listing.crop_type,
          quantity_tons: listing.quantity_tons,
          buyer_name: 'Buyer Name', // This would come from actual buyer data
          reference_number: `TXN${listing.id.slice(-8).toUpperCase()}`,
          notes: listing.location_description || '' // Using location_description as notes
        }));

        setPayments(paymentRecords);
        
        // Calculate totals
        const total = paymentRecords
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthly = paymentRecords
          .filter(p => {
            const paymentDate = new Date(p.transaction_date);
            return p.status === 'completed' && 
                   paymentDate.getMonth() === currentMonth && 
                   paymentDate.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + p.amount, 0);

        setTotalEarnings(total);
        setMonthlyEarnings(monthly);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'default';
      case 'subsidy': return 'secondary';
      case 'free_pickup': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('farmer.paymentRecords')}</h1>
        <p className="text-muted-foreground">
          {t('farmer.paymentHistory')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('farmer.totalEarnings')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('farmer.currentMonthEarnings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('farmer.thisMonth')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('farmer.currentMonthEarnings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('farmer.totalTransactions')}</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('farmer.completedPayments')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('farmer.searchPayments')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payment Records */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {searchQuery ? t('farmer.noPaymentMatch') : t('farmer.noPaymentRecords')}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery 
              ? t('farmer.adjustSearchTerms')
              : t('farmer.paymentRecordsDescription')
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {payment.crop_type.charAt(0).toUpperCase() + payment.crop_type.slice(1)} • {payment.quantity_tons} tons
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <Badge variant={getPaymentTypeColor(payment.payment_type)}>
                      {payment.payment_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Date:</span>
                    <p>{new Date(payment.transaction_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Reference:</span>
                    <p className="font-mono">{payment.reference_number}</p>
                  </div>
                  {payment.buyer_name && (
                    <div>
                      <span className="font-medium text-muted-foreground">Buyer:</span>
                      <p>{payment.buyer_name}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-muted-foreground">Rate:</span>
                    <p>₹{(payment.amount / payment.quantity_tons).toFixed(2)}/ton</p>
                  </div>
                </div>

                {payment.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="font-medium text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1">{payment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}