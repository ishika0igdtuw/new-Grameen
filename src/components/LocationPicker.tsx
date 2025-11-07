import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Crosshair, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; description: string }) => void;
  initialLocation?: { latitude: number; longitude: number; description: string };
  className?: string;
}

export const LocationPicker = ({ onLocationSelect, initialLocation, className }: LocationPickerProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialLocation?.description || ''
  );
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Using Nominatim API (OpenStreetMap) for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      
      // Filter results to only include locations in India
      const indiaResults = data.filter((result: any) => 
        result.display_name.toLowerCase().includes('india') ||
        result.address?.country === 'India' ||
        result.address?.country_code === 'in'
      );
      
      setSearchResults(indiaResults);
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchLocation(searchQuery);
  };

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Search for nearby locations to give user options
          const nearbyResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&limit=8`
          );
          const nearbyData = await nearbyResponse.json();
          
          // Also get reverse geocoding for current exact location
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await response.json();
          
          // Format a nice address from the response
          const currentAddress = formatAddress(data.address, data.display_name);
          
          // Combine current location with nearby options
          const allOptions = [
            {
              ...data,
              display_name: `📍 Current Location: ${currentAddress}`,
              isCurrentLocation: true
            },
            ...nearbyData.filter((result: any) => 
              result.display_name.toLowerCase().includes('india') ||
              result.address?.country === 'India' ||
              result.address?.country_code === 'in'
            ).slice(0, 5)
          ];
          
          setSearchResults(allOptions);
          
          toast({
            title: "Location found",
            description: "Select your exact location from the options below"
          });
        } catch (error) {
          console.error('Error getting address:', error);
          toast({
            title: "Error",
            description: "Failed to get location details. Please search manually.",
            variant: "destructive"
          });
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: "Location error",
          description: "Failed to get your location. Please search manually.",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const formatAddress = (addressComponents: any, displayName: string) => {
    if (!addressComponents) return displayName;

    const parts = [];
    
    // Add house number and road
    if (addressComponents.house_number && addressComponents.road) {
      parts.push(`${addressComponents.house_number} ${addressComponents.road}`);
    } else if (addressComponents.road) {
      parts.push(addressComponents.road);
    }
    
    // Add locality/neighbourhood
    if (addressComponents.neighbourhood || addressComponents.locality) {
      parts.push(addressComponents.neighbourhood || addressComponents.locality);
    }
    
    // Add village or town
    if (addressComponents.village || addressComponents.town || addressComponents.city) {
      parts.push(addressComponents.village || addressComponents.town || addressComponents.city);
    }
    
    // Add state and country
    if (addressComponents.state) {
      parts.push(addressComponents.state);
    }
    
    return parts.length > 0 ? parts.join(', ') : displayName;
  };

  const selectLocation = (result: any) => {
    let formattedAddress;
    let lat, lon;
    
    if (result.isCurrentLocation) {
      // For current location, extract coordinates from the result
      lat = result.lat;
      lon = result.lon;
      formattedAddress = result.display_name.replace('📍 Current Location: ', '');
    } else {
      lat = parseFloat(result.lat);
      lon = parseFloat(result.lon);
      formattedAddress = formatAddress(result.address, result.display_name);
    }
    
    setSelectedLocation(formattedAddress);
    onLocationSelect({
      latitude: lat,
      longitude: lon,
      description: formattedAddress
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Select Location *
      </Label>
      
      <div className="space-y-3">
        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="w-full"
        >
          <Crosshair className="h-4 w-4 mr-2" />
          {gettingLocation ? "Getting your location..." : "Use my current location"}
        </Button>

        {/* Search Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter street address, landmark, pincode, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchEnter}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter location details and click Search • Or use current location for nearby options
          </p>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardContent className="p-2">
              <div className="space-y-1">
                {searchResults.map((result, index) => {
                  const formattedAddress = formatAddress(result.address, result.display_name);
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3"
                      onClick={() => selectLocation(result)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {result.isCurrentLocation 
                            ? "📍 Current Location" 
                            : (result.address?.road || result.name || 'Unknown location')
                          }
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formattedAddress}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Location Display */}
        {selectedLocation && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-700 dark:text-green-300">Selected Location</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {selectedLocation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};