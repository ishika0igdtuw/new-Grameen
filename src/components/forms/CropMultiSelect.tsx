import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

// Only crops that produce agricultural residue for marketplace
const RESIDUE_CROPS = [
  'Paddy/Rice', 'Wheat', 'Maize/Corn', 'Sugarcane', 'Cotton',
  'Sunflower', 'Bajra/Millet', 'Jowar/Sorghum', 'Barley', 'Mustard'
];

interface CropMultiSelectProps {
  selectedCrops: string[];
  onChange: (crops: string[]) => void;
  label?: string;
}

export const CropMultiSelect = ({ selectedCrops, onChange, label = "Crops You Grow" }: CropMultiSelectProps) => {
  const [customCrop, setCustomCrop] = useState('');

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      onChange(selectedCrops.filter(c => c !== crop));
    } else {
      onChange([...selectedCrops, crop]);
    }
  };

  const addCustomCrop = () => {
    if (customCrop.trim() && !selectedCrops.includes(customCrop.trim())) {
      onChange([...selectedCrops, customCrop.trim()]);
      setCustomCrop('');
    }
  };

  const removeCrop = (crop: string) => {
    onChange(selectedCrops.filter(c => c !== crop));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">{label} *</label>
      
      {/* Selected crops */}
      {selectedCrops.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCrops.map((crop) => (
            <Badge key={crop} variant="secondary" className="flex items-center gap-1">
              {crop}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeCrop(crop)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Residue crops selection */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3 text-foreground">Select crops that produce agricultural residue:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RESIDUE_CROPS.map((crop) => (
            <Button
              key={crop}
              variant={selectedCrops.includes(crop) ? "default" : "outline"}
              size="sm"
              className="text-xs h-8"
              onClick={() => toggleCrop(crop)}
              type="button"
            >
              {crop}
            </Button>
          ))}
        </div>
      </Card>

      {/* Custom crop input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add other crop..."
          value={customCrop}
          onChange={(e) => setCustomCrop(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomCrop();
            }
          }}
        />
        <Button 
          onClick={addCustomCrop}
          variant="outline" 
          size="sm"
          type="button"
          disabled={!customCrop.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
};