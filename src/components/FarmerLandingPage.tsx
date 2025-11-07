import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, DollarSign, Tractor, Users, ArrowRight, CheckCircle, BarChart3 } from 'lucide-react';
import farmerWithWheat from '/lovable-uploads/4d364c99-6010-4c4a-8ae5-2839a7809c46.png';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useTranslation } from 'react-i18next';

interface FarmerLandingPageProps {
  onNavigate: (section: 'sell-residue' | 'my-listings' | 'rent-machinery' | 'analytics' | 'profile') => void;
  farmerData?: {
    farmer_name?: string;
    village?: string;
    panchayats?: { name?: string; id?: string };
    residueCount?: number;
    machineBookings?: number;
    totalEarnings?: number;
  };
}

export const FarmerLandingPage = ({ onNavigate, farmerData }: FarmerLandingPageProps) => {
  const { t } = useTranslation();
  
  const benefits = [
    {
      icon: Leaf,
      title: t('farmerLanding.benefit1Title'),
      description: t('farmerLanding.benefit1Description'),
      color: "text-green-600"
    },
    {
      icon: Leaf,
      title: t('farmerLanding.benefit2Title'), 
      description: t('farmerLanding.benefit2Description'),
      color: "text-emerald-600"
    },
    {
      icon: Tractor,
      title: t('farmerLanding.benefit3Title'),
      description: t('farmerLanding.benefit3Description'),
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: t('farmerLanding.benefit4Title'),
      description: t('farmerLanding.benefit4Description'),
      color: "text-purple-600"
    }
  ];

  const stats = [
    { label: t('farmerLanding.stat1Label'), value: "5,000+", color: "bg-blue-500" },
    { label: t('farmerLanding.stat2Label'), value: "150K+", color: "bg-green-500" },
    { label: t('farmerLanding.stat3Label'), value: "₹2Cr+", color: "bg-yellow-500" },
    { label: t('farmerLanding.stat4Label'), value: "300K kg", color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={farmerWithWheat} 
            alt="Farmer with wheat in field"
            className="w-full h-full object-cover object-center filter-none"
            style={{ imageRendering: 'crisp-edges' }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('farmerLanding.heroTitle')}
              <span className="text-green-400 block">{t('farmerLanding.heroTitleHighlight')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('farmerLanding.heroSubtitle')}
            </p>
            
            {/* Remove buttons since navigation is now in header */}
          </div>
        </div>
      </div>


      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('farmerLanding.benefitsTitle')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('farmerLanding.benefitsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-white">
              <CardHeader className="text-center pb-4">
                <benefit.icon className={`h-16 w-16 mx-auto mb-6 ${benefit.color}`} />
                <CardTitle className="text-2xl font-bold">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Platform Stats */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-4xl text-center mb-10 font-bold">{t('farmerLanding.statsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`w-20 h-20 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-3">{stat.value}</div>
                  <p className="text-green-100 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700 py-20">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold text-white mb-8">
            {t('farmerLanding.ctaTitle')}
          </h2>
          <p className="text-2xl text-green-100 mb-12">
            {t('farmerLanding.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg border border-gray-200"
              onClick={() => onNavigate('sell-residue')}
            >
              {t('farmerLanding.listResidue')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg bg-transparent"
              onClick={() => onNavigate('rent-machinery')}
            >
              <Tractor className="mr-2 h-5 w-5" />
              {t('farmerLanding.exploreMachines')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};