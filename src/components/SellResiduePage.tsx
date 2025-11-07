import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Wheat, Leaf, CheckCircle } from 'lucide-react';
import { ResidueListingForm } from '@/components/forms/ResidueListingForm';
import { useTranslation } from 'react-i18next';

// Crop images imports
import paddyResidue from '@/assets/crops/paddy-residue.jpg';
import wheatResidue from '@/assets/crops/wheat-residue.jpg';
import maizeResidue from '@/assets/crops/maize-residue.jpg';
import sugarcaneResidue from '@/assets/crops/sugarcane-residue.jpg';
import cottonResidue from '@/assets/crops/cotton-residue.jpg';
import sunflowerResidue from '@/assets/crops/sunflower-residue.jpg';

interface SellResiduePageProps {
  onNavigateToListings: () => void;
  showFormDirectly?: boolean;
}

export const SellResiduePage = ({ onNavigateToListings, showFormDirectly = false }: SellResiduePageProps) => {
  const { t } = useTranslation();
  const [showResidueForm, setShowResidueForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const cropTypes = [
    {
      id: 'paddy',
      name: t('sellResidue.cropTypes.paddy.name'),
      image: paddyResidue,
      description: t('sellResidue.cropTypes.paddy.description'),
      avgPrice: '₹2,500-3,500/ton',
      currentStock: '150 tons available',
      demandLevel: 'High'
    },
    {
      id: 'wheat',
      name: t('sellResidue.cropTypes.wheat.name'),
      image: wheatResidue,
      description: t('sellResidue.cropTypes.wheat.description'),
      avgPrice: '₹2,000-3,000/ton',
      currentStock: '200 tons available',
      demandLevel: 'Medium'
    },
    {
      id: 'maize',
      name: t('sellResidue.cropTypes.maize.name'),
      image: maizeResidue,
      description: t('sellResidue.cropTypes.maize.description'),
      avgPrice: '₹1,800-2,800/ton',
      currentStock: '80 tons available',
      demandLevel: 'Medium'
    },
    {
      id: 'sugarcane',
      name: t('sellResidue.cropTypes.sugarcane.name'),
      image: sugarcaneResidue,
      description: t('sellResidue.cropTypes.sugarcane.description'),
      avgPrice: '₹3,000-4,000/ton',
      currentStock: '120 tons available',
      demandLevel: 'High'
    },
    {
      id: 'cotton',
      name: t('sellResidue.cropTypes.cotton.name'),
      image: cottonResidue,
      description: t('sellResidue.cropTypes.cotton.description'),
      avgPrice: '₹1,500-2,500/ton',
      currentStock: '90 tons available',
      demandLevel: 'Low'
    },
    {
      id: 'sunflower',
      name: t('sellResidue.cropTypes.sunflower.name'),
      image: sunflowerResidue,
      description: t('sellResidue.cropTypes.sunflower.description'),
      avgPrice: '₹1,800-2,600/ton',
      currentStock: '60 tons available',
      demandLevel: 'Medium'
    }
  ];

  const handleCropSelect = (cropType: string) => {
    setSelectedCrop(cropType);
    setShowResidueForm(true);
  };

  // If accessed from navigation, show the listing form only (not combined)
  if (showFormDirectly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('sellResidue.listFormTitle')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('sellResidue.listFormSubtitle')}
            </p>
          </div>
          
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8">
              <ResidueListingForm 
                onSuccess={() => {
                  onNavigateToListings();
                }}
                onCancel={() => {
                  // Stay on the same page
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('sellResidue.title')}
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            {t('sellResidue.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onNavigateToListings}
              variant="outline"
              className="px-8 py-4 text-lg font-semibold"
            >
              {t('sellResidue.viewMyListings')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Crop Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cropTypes.map((crop) => (
            <Card 
              key={crop.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden"
              onClick={() => handleCropSelect(crop.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={crop.image} 
                  alt={`${crop.name} residue`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge className={`${crop.demandLevel === 'High' ? 'bg-green-500' : crop.demandLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    {crop.demandLevel} Demand
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2">{crop.name}</h3>
                  <p className="text-green-300 font-semibold text-lg">{crop.avgPrice}</p>
                  <p className="text-blue-300 text-sm">{crop.currentStock}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 text-lg leading-relaxed mb-3">
                    {crop.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="text-gray-500">Market Price</span>
                      <p className="font-semibold text-green-600">{crop.avgPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Available</span>
                      <p className="font-semibold text-blue-600">{crop.currentStock}</p>
                    </div>
                  </div>
                </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCropSelect(crop.id);
                }}
              >
                <Wheat className="mr-2 h-5 w-5" />
                List {crop.name} Residue
              </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                {t('sellResidue.howItWorksTitle')}
              </CardTitle>
              <CardDescription className="text-lg text-center">
                {t('sellResidue.howItWorksSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('sellResidue.step1Title')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('sellResidue.step1Description')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('sellResidue.step2Title')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('sellResidue.step2Description')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-yellow-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('sellResidue.step3Title')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('sellResidue.step3Description')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listing Form Dialog */}
      <Dialog open={showResidueForm} onOpenChange={setShowResidueForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ResidueListingForm 
            onSuccess={() => {
              setShowResidueForm(false);
              setSelectedCrop(null);
            }}
            onCancel={() => {
              setShowResidueForm(false);
              setSelectedCrop(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};