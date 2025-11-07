import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Wheat, ShoppingCart, Eye } from 'lucide-react';
import { AggregatedMarketplace } from '@/components/AggregatedMarketplace';

interface ResidueListingWithDetails {
  id: string;
  crop_type: string;
  quantity_tons: number;
  price_per_ton: number;
  disposal_method: string;
  status: string;
  location_description: string;
  harvest_date: string;
  created_at: string;
  farmers: {
    farmer_name: string;
    village: string;
  };
  panchayats: {
    name: string;
    village: string;
    district: string;
    state: string;
  };
}

export const BuyerDashboard = () => {
  return <AggregatedMarketplace />;
};