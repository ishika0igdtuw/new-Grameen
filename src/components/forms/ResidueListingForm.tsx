import { MarketplaceResidueForm } from './MarketplaceResidueForm';

interface ResidueListingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ResidueListingForm = ({ onSuccess, onCancel }: ResidueListingFormProps) => {
  return <MarketplaceResidueForm onSuccess={onSuccess} onCancel={onCancel} />;
};