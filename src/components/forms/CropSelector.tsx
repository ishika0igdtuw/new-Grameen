import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import crop images
import paddyResidue from '@/assets/crops/paddy-residue.jpg';
import wheatResidue from '@/assets/crops/wheat-residue.jpg';
import sunflowerResidue from '@/assets/crops/sunflower-residue.jpg';
import huskResidue from '@/assets/crops/husk-residue.jpg';
import sugarcaneResidue from '@/assets/crops/sugarcane-residue.jpg';
import cottonResidue from '@/assets/crops/cotton-residue.jpg';
import maizeResidue from '@/assets/crops/maize-residue.jpg';

interface CropOption {
  value: string;
  label: string;
  image: string;
  description: string;
}

const cropOptions: CropOption[] = [
  {
    value: 'paddy',
    label: 'Paddy Rice',
    image: paddyResidue,
    description: 'Rice stubble and straw after harvest'
  },
  {
    value: 'wheat',
    label: 'Wheat',
    image: wheatResidue,
    description: 'Wheat stubble and straw residue'
  },
  {
    value: 'sunflower',
    label: 'Sunflower',
    image: sunflowerResidue,
    description: 'Sunflower stalks and stems'
  },
  {
    value: 'husk',
    label: 'Rice Husk',
    image: huskResidue,
    description: 'Rice husk from processing'
  },
  {
    value: 'sugarcane',
    label: 'Sugarcane',
    image: sugarcaneResidue,
    description: 'Sugarcane bagasse and tops'
  },
  {
    value: 'cotton',
    label: 'Cotton',
    image: cottonResidue,
    description: 'Cotton stalks and stems'
  },
  {
    value: 'maize',
    label: 'Maize/Corn',
    image: maizeResidue,
    description: 'Corn stover - stalks and leaves'
  }
];

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (cropType: string) => void;
  className?: string;
}

export const CropSelector = ({ selectedCrop, onSelectCrop, className }: CropSelectorProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">Select Your Crop Residue</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of crop residue you want to sell
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cropOptions.map((crop) => (
          <Card
            key={crop.value}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedCrop === crop.value
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "hover:border-primary/50"
            )}
            onClick={() => onSelectCrop(crop.value)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <img
                  src={crop.image}
                  alt={crop.label}
                  className="w-full h-32 object-cover rounded-md"
                />
                {selectedCrop === crop.value && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{crop.label}</h4>
                  {selectedCrop === crop.value && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {crop.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};