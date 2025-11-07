import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Building,
  User,
  BarChart3,
  Package,
  DollarSign,
  Calendar,
  Wheat,
  TrendingUp,
  Factory,
  Truck,
  Leaf,
  MapPin,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { AggregatedMarketplace } from '@/components/AggregatedMarketplace';
import biomassMaterials from '@/assets/biomass-materials.jpg';

interface IndustryDashboardProps {
  activeSection?: 'dashboard' | 'marketplace' | 'orders' | 'profile';
  onNavigate?: (section: 'dashboard' | 'marketplace' | 'orders' | 'profile') => void;
}

export const IndustryDashboard = ({ activeSection = 'dashboard', onNavigate }: IndustryDashboardProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [profile]);

  const fetchOrders = async () => {
    if (!profile) return;
    
    try {
      // Fetch orders - fix the relationship issue
      const { data: purchases, error } = await supabase
        .from('bulk_purchases')
        .select(`
          *
        `)
        .eq('buyer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        // Continue without throwing to show other parts of dashboard
      } else {
        setOrders(purchases || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Don't show error toast for this, just log it
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalQuantity = orders.reduce((sum, order) => sum + order.total_quantity_tons, 0);
    const pendingOrders = orders.filter(order => order.payment_status === 'pending').length;
    
    return { totalOrders, totalSpent, totalQuantity, pendingOrders };
  };

  const { totalOrders, totalSpent, totalQuantity, pendingOrders } = calculateStats();

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={biomassMaterials}
            alt="Industrial biomass processing facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
              MAKE
              <span className="text-green-400 block">PROFIT</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform agricultural waste into valuable resources. 
              Source sustainable biomass directly from verified panchayats.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white hover:text-green-900 px-8 py-4 text-lg transition-colors"
                onClick={() => onNavigate?.('marketplace')}
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                Browse Marketplace
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg transition-colors"
              >
                <BarChart3 className="mr-2 h-6 w-6" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Industry Benefits
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Sustainable sourcing, cost savings, and environmental impact - all in one platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <Leaf className="h-14 w-14 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-xl font-bold">Sustainable Sourcing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Source eco-friendly biomass directly from farmers, reducing environmental impact
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <DollarSign className="h-14 w-14 mx-auto mb-4 text-blue-600" />
              <CardTitle className="text-xl font-bold">Cost Effective</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Competitive pricing direct from source, eliminating middleman costs
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <Factory className="h-14 w-14 mx-auto mb-4 text-purple-600" />
              <CardTitle className="text-xl font-bold">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Verified panchayats ensure consistent quality and reliable supply chains
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <Truck className="h-14 w-14 mx-auto mb-4 text-orange-600" />
              <CardTitle className="text-xl font-bold">Efficient Logistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Streamlined collection and delivery with integrated machinery support
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <BarChart3 className="h-14 w-14 mx-auto mb-4 text-red-600" />
              <CardTitle className="text-xl font-bold">Data Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Track your sourcing patterns and optimize procurement strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
            <CardHeader className="text-center pb-4">
              <Building className="h-14 w-14 mx-auto mb-4 text-indigo-600" />
              <CardTitle className="text-xl font-bold">Compliance Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Meet sustainability requirements with verified environmental impact data
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats */}
        <Card className="bg-gradient-to-r from-blue-600 to-green-600 border-0 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-8 font-bold">Your Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{totalOrders}</div>
                <p className="text-blue-100">Total Orders</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">₹{totalSpent.toLocaleString()}</div>
                <p className="text-blue-100">Total Investment</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{totalQuantity} tons</div>
                <p className="text-blue-100">Biomass Sourced</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{Math.round(totalQuantity * 2.5)} tons</div>
                <p className="text-blue-100">CO₂ Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              Total Quantity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalQuantity} tons</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your latest biomass procurement activities</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start by exploring our marketplace to find the best biomass deals!</p>
                <Button onClick={() => onNavigate?.('marketplace')} className="bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-semibold text-lg capitalize mb-1">
                        {order.crop_type.replace('_', ' ')} Residue - {order.total_quantity_tons} tons
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Order from Panchayat • {order.panchayat_id || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ordered on {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-green-600 mb-2">₹{order.total_amount.toLocaleString()}</div>
                      <Badge 
                        variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                        className={order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">View All Orders</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Orders & Purchase History</h2>
          <p className="text-muted-foreground">Track your biomass procurement and delivery status</p>
        </div>
      </div>

      {/* Active Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            Active Orders ({orders.filter(order => order.payment_status !== 'completed').length})
          </CardTitle>
          <CardDescription>Current orders in progress</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.filter(order => order.payment_status !== 'completed').length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Orders</h3>
              <p className="text-muted-foreground mb-4">All your orders have been completed</p>
              <Button onClick={() => onNavigate?.('marketplace')} className="bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.filter(order => order.payment_status !== 'completed').map((order) => (
                <div key={order.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold capitalize">
                          {order.crop_type.replace('_', ' ')} Residue
                        </h3>
                        <Badge variant={
                          order.payment_status === 'paid' ? 'default' : 
                          order.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {order.payment_status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Quantity:</span>
                          <div className="font-semibold">{order.total_quantity_tons} tons</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Total Amount:</span>
                          <div className="font-semibold text-green-600">₹{order.total_amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Order Date:</span>
                          <div className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        Panchayat ID: {order.panchayat_id || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                  
                  {/* Order Status Timeline */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Order Placed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.payment_status === 'paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>Payment {order.payment_status === 'paid' ? 'Completed' : 'Pending'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>In Transit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5" />
            Purchase History ({orders.length} total orders)
          </CardTitle>
          <CardDescription>Complete record of all your biomass purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Purchase History</h3>
              <p className="text-muted-foreground mb-4">Start purchasing biomass to see your history here</p>
              <Button onClick={() => onNavigate?.('marketplace')} className="bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Crop Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold">Price/Ton</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {order.crop_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {order.total_quantity_tons} tons
                      </td>
                      <td className="py-3 px-4 text-sm">
                        ₹{Math.round(order.total_amount / order.total_quantity_tons).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ₹{order.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={
                          order.payment_status === 'paid' ? 'default' : 
                          order.payment_status === 'completed' ? 'default' :
                          order.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Analytics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Leaf className="h-5 w-5 text-green-600" />
            Environmental Impact
          </CardTitle>
          <CardDescription>Your contribution to sustainable farming</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalQuantity} tons
              </div>
              <div className="text-sm text-muted-foreground">Biomass Purchased</div>
              <div className="text-xs text-green-600 mt-1">Total residue sourced</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(totalQuantity * 2.5)} tons
              </div>
              <div className="text-sm text-muted-foreground">CO₂ Emissions Saved</div>
              <div className="text-xs text-blue-600 mt-1">Prevented from burning</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(totalQuantity * 50)}
              </div>
              <div className="text-sm text-muted-foreground">Trees Equivalent</div>
              <div className="text-xs text-purple-600 mt-1">Environmental benefit</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">Monthly Purchase Trend</h4>
            <div className="h-32 flex items-end justify-between gap-2">
              {[65, 45, 80, 60, 75, 90, 85, 95, 70, 85, 60, 100].map((height, index) => (
                <div key={index} className="flex-1 bg-green-200 rounded-t" style={{ height: `${height}%` }}>
                  <div className="w-full bg-green-500 rounded-t" style={{ height: '20%' }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">Browse and purchase crop residue from verified panchayats</p>
        </div>
      </div>
      <AggregatedMarketplace />
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-muted-foreground">Manage your account settings and information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input value={profile?.full_name || 'Not set'} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={profile?.email || 'Not set'} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={profile?.phone || 'Not set'} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input value={profile?.role || 'Not set'} disabled />
            </div>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalQuantity} tons</div>
              <div className="text-sm text-muted-foreground">Total Quantity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'marketplace':
        return renderMarketplace();
      case 'orders':
        return renderOrders();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};