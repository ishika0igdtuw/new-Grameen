import { useTranslation } from 'react-i18next';

// Utility function to translate common names and places
export const useTranslatedText = () => {
  const { t, i18n } = useTranslation();
  
  const translateName = (name: string): string => {
    if (i18n.language === 'hi') {
      return t(`analytics.commonNames.${name}`, { defaultValue: name });
    }
    return name;
  };
  
  const translatePlace = (place: string): string => {
    if (i18n.language === 'hi') {
      return t(`analytics.commonPlaces.${place}`, { defaultValue: place });
    }
    return place;
  };

  const translateCropName = (cropName: string): string => {
    if (i18n.language === 'hi') {
      return t(`analytics.cropNames.${cropName}`, { defaultValue: cropName });
    }
    return cropName;
  };
  
  const translateFarmerProfile = (farmerName?: string, village?: string, panchayatName?: string, district?: string, state?: string) => {
    if (i18n.language === 'hi') {
      return {
        name: farmerName ? translateName(farmerName) : '',
        village: village ? translatePlace(village) : '',
        panchayat: panchayatName ? translatePlace(panchayatName) : '',
        district: district ? translatePlace(district) : '',
        state: state ? translatePlace(state) : ''
      };
    }
    
    return {
      name: farmerName || '',
      village: village || '',
      panchayat: panchayatName || '',
      district: district || '',
      state: state || ''
    };
  };
  
  return {
    translateName,
    translatePlace,
    translateCropName,
    translateFarmerProfile
  };
};