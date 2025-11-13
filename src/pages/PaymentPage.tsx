import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { grameenChain } from '@/lib/blockchain';
import { loadRazorpayScript, RAZORPAY_KEY_ID } from '@/lib/razorpayConfig';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Clock,
  Download
} from 'lucide-react';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    fetchOrder();
    // Load Razorpay script
    loadRazorpayScript()
      .then(() => {
        setRazorpayLoaded(true);
        console.log('Razorpay script loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load Razorpay:', error);
        toast({
          title: 'Payment Error',
          description: 'Failed to load payment gateway. Please refresh the page.',
          variant: 'destructive'
        });
      });
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      // Try bulk_purchases first
      const { data: bulkPurchase, error: bulkError } = await supabase
        .from('bulk_purchases')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!bulkError && bulkPurchase) {
        setOrder({ ...bulkPurchase, type: 'bulk' });
        setLoading(false);
        return;
      }

      // Try purchases table
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!purchaseError && purchase) {
        setOrder({ ...purchase, type: 'individual' });
        setLoading(false);
        return;
      }

      throw new Error('Order not found');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load order',
        variant: 'destructive'
      });
      navigate('/dashboard');
    }
  };

  const handlePayment = async () => {
    if (!order || !profile || !razorpayLoaded) {
      if (!razorpayLoaded) {
        toast({
          title: 'Payment Gateway Not Ready',
          description: 'Please wait for payment gateway to load.',
          variant: 'destructive'
        });
      }
      return;
    }

    if (!window.Razorpay) {
      toast({
        title: 'Payment Error',
        description: 'Razorpay SDK not loaded. Please refresh the page.',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    try {
      const amount = Math.round((order.total_amount || order.amount) * 100); // Convert to paise
      const currency = 'INR';
      
      console.log('Initiating Razorpay payment:', {
        amount,
        currency,
        orderId,
        keyId: RAZORPAY_KEY_ID
      });
      
      // Configure Razorpay options
      // Note: For production, you should create orders server-side for security
      // For now, we'll use direct payment without order_id (works for testing)
      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Grameen Crop Residue',
        description: `Payment for Order ${orderId} - ${order.crop_type?.replace('_', ' ') || 'Crop Residue'}`,
        handler: async (response: any) => {
          console.log('Razorpay payment success:', response);
          setProcessing(false);
          await processPaymentSuccess(response);
        },
        prefill: {
          name: profile.full_name || profile.email?.split('@')[0] || 'Customer',
          email: profile.email || '',
          contact: profile.phone || ''
        },
        notes: {
          order_id: orderId,
          order_type: order.type,
          crop_type: order.crop_type
        },
        theme: {
          color: '#10b981' // Green color
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            console.log('Payment modal closed by user');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async (response: any) => {
        console.error('Razorpay payment failed:', response);
        setProcessing(false);
        await handlePaymentFailure(response.error?.description || response.error?.reason || 'Payment failed');
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      setProcessing(false);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const processPaymentSuccess = async (razorpayResponse?: any) => {
    if (!order) return;

    try {
      const paymentRefId = razorpayResponse?.razorpay_payment_id || 
                          razorpayResponse?.payment_id || 
                          `pay_${Date.now()}`;
      const razorpayOrderId = razorpayResponse?.razorpay_order_id || '';
      const razorpaySignature = razorpayResponse?.razorpay_signature || '';
      
      console.log('Processing payment success:', {
        paymentRefId,
        razorpayOrderId,
        razorpaySignature
      });
      
      // Update order status
      if (order.type === 'bulk') {
        const { error } = await supabase
          .from('bulk_purchases')
          .update({ 
            payment_status: 'paid',
            payment_id: paymentRefId
          })
          .eq('id', order.id);

        if (error) {
          console.error('Error updating bulk purchase:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('purchases')
          .update({ 
            payment_status: 'paid',
            payment_id: paymentRefId
          })
          .eq('id', order.id);

        if (error) {
          console.error('Error updating purchase:', error);
          throw error;
        }
      }

      // Record blockchain transaction
      try {
        grameenChain.addBlock({
          timestamp: new Date().toISOString(),
          data: {
            type: 'PAYMENT',
            orderId: order.id,
            orderType: order.type,
            amount: order.total_amount || order.amount,
            status: 'success',
            buyerId: profile?.id,
            paymentRefId,
            razorpayOrderId,
            razorpaySignature,
            paymentMethod: paymentMethod || 'razorpay'
          }
        });
      } catch (blockchainError) {
        console.warn('Blockchain logging failed:', blockchainError);
      }

      setPaymentSuccess(true);
      setProcessing(false);
      toast({
        title: 'Payment Successful!',
        description: `Your payment of ₹${(order.total_amount || order.amount).toLocaleString()} has been processed. Payment ID: ${paymentRefId}`
      });

      setTimeout(() => {
        navigate('/dashboard?section=orders');
      }, 3000);
    } catch (error: any) {
      console.error('Error processing payment success:', error);
      handlePaymentFailure(error.message || 'Failed to update order status');
    }
  };

  const handlePaymentFailure = async (reason: string) => {
    if (!order) return;

    try {
      // Record failed payment in blockchain
      grameenChain.addBlock({
        timestamp: new Date().toISOString(),
        data: {
          type: 'PAYMENT',
          orderId: order.id,
          orderType: order.type,
          amount: order.total_amount || order.amount,
          status: 'failed',
          buyerId: profile?.id,
          reason,
          paymentMethod
        }
      });

      setPaymentFailed(true);
      setProcessing(false);
      toast({
        title: 'Payment Failed',
        description: reason,
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error recording failed payment:', error);
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentFailed(false);
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 text-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-10 pb-10">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto py-10 max-w-2xl min-h-screen">
        <Card className="border-green-500">
          <CardContent className="pt-10 pb-10 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed. Redirecting to orders...
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
              <p className="text-lg font-semibold">
                Amount: ₹{(order.total_amount || order.amount).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentFailed) {
    return (
      <div className="container mx-auto py-10 max-w-2xl min-h-screen">
        <Card className="border-red-500">
          <CardContent className="pt-10 pb-10 text-center">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">
              Your payment could not be processed. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry}>Retry Payment</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-muted-foreground">Secure payment for your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Crop Type</p>
              <p className="font-medium capitalize">
                {order.crop_type?.replace('_', ' ') || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">
                {order.total_quantity_tons || order.quantity_tons} tons
              </p>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">
                ₹{(order.total_amount || order.amount).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Secure Payment:</strong> You will be redirected to Razorpay's secure payment gateway to complete your transaction.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                All payment methods (UPI, Cards, Net Banking, Wallets) are supported.
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={processing || !razorpayLoaded}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening Payment Gateway...
                </>
              ) : !razorpayLoaded ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Payment Gateway...
                </>
              ) : (
                `Pay ₹${(order.total_amount || order.amount).toLocaleString()}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

