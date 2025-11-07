import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LandholdingInputProps {
  value: string;
  unit: string;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
}

const LAND_UNITS = [
  { value: 'acres', label: 'Acres' },
  { value: 'hectares', label: 'Hectares' },
  { value: 'bigha', label: 'Bigha' }
];

export const LandholdingInput = ({ value, unit, onValueChange, onUnitChange }: LandholdingInputProps) => {
  return (
    <div>
      <Label htmlFor="landholding">Landholding Size</Label>
      <div className="flex gap-2">
        <Input
          id="landholding"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Enter size"
          type="number"
          step="0.1"
          className="flex-1"
        />
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {LAND_UNITS.map((unitOption) => (
              <SelectItem key={unitOption.value} value={unitOption.value}>
                {unitOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};