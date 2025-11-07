import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Leaf, 
  TrendingUp, 
  Recycle, 
  DollarSign, 
  Truck, 
  Users,
  TreePine,
  Wind
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface EnvironmentalData {
  totalResidueCollected: number;
  totalIncome: number;
  co2Saved: number;
  airQualityImprovement: number;
  soilHealthPreserved: number;
  stubbleBurningReduced: number;
  disposalMethods: Array<{ method: string; count: number; percentage: number }>;
  monthlyTrends: Array<{ month: string; residue: number; income: number }>;
  cropTypes: Array<{ crop: string; quantity: number; value: number; co2Factor: number }>;
  panchayatData?: {
    totalPanchayats: number;
    totalFarmers: number;
    averageIncomePerPanchayat: number;
    topPerformingPanchayats: Array<{ name: string; income: number; residue: number }>;
  };
}

interface AnalyticsDashboardProps {
  panchayatId?: string;
  farmerId?: string;
  showGlobal?: boolean;
}

export const AnalyticsDashboard = ({ panchayatId, farmerId, showGlobal = false }: AnalyticsDashboardProps) => {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState<EnvironmentalData>({
    totalResidueCollected: 0,
    totalIncome: 0,
    co2Saved: 0,
    airQualityImprovement: 0,
    soilHealthPreserved: 0,
    stubbleBurningReduced: 0,
    disposalMethods: [],
    monthlyTrends: [],
    cropTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [panchayatId, farmerId, showGlobal]);

  const fetchAnalyticsData = async () => {
    try {
      // For farmer analytics, get ALL listings (both with and without purchases)
      // For panchayat/global analytics, only get listings with purchases
      let query = supabase
        .from('crop_residue_listings')
        .select(`
          *,
          purchases(*)
        `);

      if (!showGlobal && panchayatId) {
        query = query.eq('panchayat_id', panchayatId);
      } else if (farmerId) {
        query = query.eq('farmer_id', farmerId);
        // For farmer analytics, get ALL listings regardless of purchase status
      }

      const { data: listingsData, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      // For panchayat/global analytics, filter out listings without purchases after fetching
      let filteredData = listingsData || [];
      if (!farmerId && (panchayatId || showGlobal)) {
        filteredData = filteredData.filter(listing => listing.purchases && listing.purchases.length > 0);
      }

      // Process the data for analytics
      const processedData = processAnalyticsData(filteredData);
      setData(processedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (listings: any[]): EnvironmentalData => {
    // For farmer analytics, include ALL listed residue (both sold and available)
    // For panchayat/global analytics, only count sold residue
    const totalResidueCollected = farmerId ? 
      listings.reduce((sum, listing) => sum + (listing.quantity_tons || 0), 0) :
      listings.reduce((sum, listing) => {
        const soldQuantity = listing.purchases?.reduce((purchaseSum: number, purchase: any) => 
          purchaseSum + purchase.quantity_tons, 0) || 0;
        return sum + soldQuantity;
      }, 0);

    // For farmer analytics, only show actual income from sold listings
    // For panchayat/global analytics, only show actual income from purchase records
    const totalIncome = farmerId ? 
      listings.reduce((sum, listing) => {
        // For farmer analytics: only count income from sold listings
        if (listing.status === 'sold') {
          const soldIncome = (listing.quantity_tons || 0) * (listing.price_per_ton || 0);
          return sum + soldIncome;
        }
        return sum; // Don't count available listings as income
      }, 0) :
      listings.reduce((sum, listing) => {
        // For panchayat/global analytics, only count actual purchase records
        const listingIncome = listing.purchases?.reduce((purchaseSum: number, purchase: any) => 
          purchaseSum + purchase.total_amount, 0) || 0;
        return sum + listingIncome;
      }, 0);

    // Enhanced environmental impact calculations using crop-specific factors
    const cropCO2Factors: Record<string, number> = {
      rice: 2.2,      // Rice residue has higher CO2 impact when burned
      wheat: 1.8,     // Wheat residue moderate impact
      sugarcane: 1.5, // Lower impact but high volume
      cotton: 1.9,    // Cotton residue high impact
      maize: 1.7,     // Corn residue moderate impact
      sunflower: 1.6, // Sunflower residue lower impact
      default: 1.8    // Default factor for unknown crops
    };

    const cropSoilFactors: Record<string, number> = {
      rice: 0.9,      // High organic matter content
      wheat: 0.8,     // Good soil enrichment
      sugarcane: 1.2, // Excellent for soil health
      cotton: 0.7,    // Lower soil benefit
      maize: 0.85,    // Good soil contribution
      sunflower: 0.75,// Moderate soil benefit
      default: 0.8    // Default factor
    };

    let co2Saved = 0;
    let soilHealthPreserved = 0;

    // Calculate CO2 and soil impact by crop type
    listings.forEach(listing => {
      // For farmer analytics, use actual quantity from listing
      // For panchayat/global analytics, use sold quantity only
      const quantity = farmerId ? 
        (listing.quantity_tons || 0) :
        (listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.quantity_tons, 0) || 0);
      
      const cropType = listing.crop_type?.toLowerCase() || 'default';
      
      const co2Factor = cropCO2Factors[cropType] || cropCO2Factors.default;
      const soilFactor = cropSoilFactors[cropType] || cropSoilFactors.default;
      
      co2Saved += quantity * co2Factor;
      soilHealthPreserved += quantity * soilFactor;
    });

    const airQualityImprovement = Math.min((totalResidueCollected / 1000) * 12, 100);
    const stubbleBurningReduced = Math.min((totalResidueCollected / 500) * 100, 100);

    // Disposal methods analysis
    const disposalMethodCounts: Record<string, number> = {};
    listings.forEach(listing => {
      disposalMethodCounts[listing.disposal_method] = (disposalMethodCounts[listing.disposal_method] || 0) + 1;
    });

    const totalListings = listings.length;
    const disposalMethods = Object.entries(disposalMethodCounts).map(([method, count]) => ({
      method: method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: totalListings > 0 ? Math.round((count / totalListings) * 100) : 0
    }));

    // Crop types analysis with CO2 factors
    const cropTypeCounts: Record<string, { quantity: number; value: number; co2Factor: number }> = {};
    listings.forEach(listing => {
      const cropType = listing.crop_type?.toLowerCase() || 'default';
      if (!cropTypeCounts[listing.crop_type]) {
        const co2Factor = cropCO2Factors[cropType] || cropCO2Factors.default;
        cropTypeCounts[listing.crop_type] = { quantity: 0, value: 0, co2Factor };
      }
      
      // For farmer analytics, use listing quantity and sold value
      // For panchayat/global analytics, use sold quantity and value only
      const quantity = farmerId ? 
        (listing.quantity_tons || 0) :
        (listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.quantity_tons, 0) || 0);
      const value = listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.total_amount, 0) || 0;
      
      cropTypeCounts[listing.crop_type].quantity += quantity;
      cropTypeCounts[listing.crop_type].value += value;
    });

    const cropTypes = Object.entries(cropTypeCounts).map(([crop, data]) => ({
      crop: crop.charAt(0).toUpperCase() + crop.slice(1),
      quantity: data.quantity,
      value: data.value,
      co2Factor: data.co2Factor
    }));

    // Monthly trends (simplified - using creation dates)
    const monthlyData: Record<string, { residue: number; income: number }> = {};
    listings.forEach(listing => {
      const month = new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { residue: 0, income: 0 };
      }
      
      // For farmer analytics, use listing quantity and sold value
      // For panchayat/global analytics, use sold quantity and value only
      const quantity = farmerId ? 
        (listing.quantity_tons || 0) :
        (listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.quantity_tons, 0) || 0);
      const value = listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.total_amount, 0) || 0;
      
      monthlyData[month].residue += quantity;
      monthlyData[month].income += value;
    });

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      residue: data.residue,
      income: data.income
    }));

    // Calculate panchayat-level data if showing global data
    let panchayatData = undefined;
    if (showGlobal) {
      const panchayatMap: Record<string, { income: number; residue: number; name: string }> = {};
      
      listings.forEach(listing => {
        const panchayatId = listing.panchayat_id;
        if (!panchayatMap[panchayatId]) {
          panchayatMap[panchayatId] = { income: 0, residue: 0, name: `Panchayat ${panchayatId.slice(-4)}` };
        }
        
        const soldQuantity = listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.quantity_tons, 0) || 0;
        const soldValue = listing.purchases?.reduce((sum: number, purchase: any) => sum + purchase.total_amount, 0) || 0;
        
        panchayatMap[panchayatId].income += soldValue;
        panchayatMap[panchayatId].residue += soldQuantity;
      });

      const panchayatEntries = Object.values(panchayatMap);
      const totalPanchayats = panchayatEntries.length;
      const totalFarmers = new Set(listings.map(l => l.farmer_id)).size;
      const averageIncomePerPanchayat = totalPanchayats > 0 ? totalIncome / totalPanchayats : 0;
      const topPerformingPanchayats = panchayatEntries
        .sort((a, b) => b.income - a.income)
        .slice(0, 5);

      panchayatData = {
        totalPanchayats,
        totalFarmers,
        averageIncomePerPanchayat,
        topPerformingPanchayats
      };
    }

    return {
      totalResidueCollected,
      totalIncome,
      co2Saved,
      airQualityImprovement,
      soilHealthPreserved,
      stubbleBurningReduced,
      disposalMethods,
      monthlyTrends,
      cropTypes,
      panchayatData
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Just the basic environmental impact metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">{t('analytics.co2EmissionsSaved')}</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{data.co2Saved.toFixed(1)} tons</div>
            <p className="text-xs text-green-700">
              {t('analytics.fromProcessed', { amount: data.totalResidueCollected.toFixed(1) })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">{t('analytics.totalResidueCollected')}</CardTitle>
            <Recycle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{data.totalResidueCollected.toFixed(1)} tons</div>
            <p className="text-xs text-blue-700">
              {t('analytics.divertedFromBurning')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t('analytics.soilHealthPreserved')}</CardTitle>
            <TreePine className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{data.soilHealthPreserved.toFixed(1)} tons</div>
            <p className="text-xs text-amber-700">
              {t('analytics.enhancedSoilQuality')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">{t('analytics.incomeGenerated')}</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">₹{data.totalIncome.toLocaleString('en-IN')}</div>
            <p className="text-xs text-purple-700">
              {t('analytics.totalFarmerEarnings')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Panchayat Analytics Section */}
      {data.panchayatData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{t('analytics.panchayatAnalytics')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-800">{t('analytics.totalPanchayats')}</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-900">{data.panchayatData.totalPanchayats}</div>
                <p className="text-xs text-indigo-700">
                  {data.panchayatData.totalFarmers} {t('analytics.farmersParticipating')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-800">{t('analytics.avgIncomePerPanchayat')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900">
                  ₹{(data.panchayatData.averageIncomePerPanchayat / 100000).toFixed(1)}L
                </div>
                <p className="text-xs text-emerald-700">
                  {t('analytics.perPanchayatEarnings')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">{t('analytics.topPerformers')}</CardTitle>
                <Truck className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">
                  {data.panchayatData.topPerformingPanchayats.length}
                </div>
                <p className="text-xs text-orange-700">
                  {t('analytics.leadingPanchayatsTracked')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Panchayats Table */}
          {data.panchayatData.topPerformingPanchayats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.topPerformingPanchayats')}</CardTitle>
                <CardDescription>
                  {t('analytics.panchayatsHighestCollection')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.panchayatData.topPerformingPanchayats.map((panchayat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{panchayat.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {panchayat.residue.toFixed(1)} tons collected
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(panchayat.income / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-muted-foreground">Total income</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Enhanced Charts Section */}
      {data.monthlyTrends.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Monthly Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('analytics.monthlyResidueCollection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="residue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crop Types Distribution with CO2 Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('analytics.cropTypesAndCO2Impact')}</CardTitle>
              <CardDescription>{t('analytics.distributionByQuantity')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.cropTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'quantity') return [`${value} tons`, 'Quantity'];
                      if (name === 'co2Factor') return [`${value}x CO₂ factor`, 'CO₂ Impact'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="quantity" fill="#10b981" name="Residue Quantity" />
                  <Bar dataKey="co2Factor" fill="#3b82f6" name="CO₂ Factor" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Income vs Collection Chart */}
      {data.monthlyTrends.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('analytics.incomeVsCollectionTrends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="residue" fill="#10b981" name="Residue (tons)" />
                <Bar yAxisId="right" dataKey="income" fill="#3b82f6" name="Income (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};