-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('panchayat_admin', 'farmer', 'buyer');

-- Create crop types enum
CREATE TYPE public.crop_type AS ENUM ('paddy', 'wheat', 'sunflower', 'husk', 'sugarcane', 'cotton', 'maize');

-- Create machine types enum
CREATE TYPE public.machine_type AS ENUM ('happy_seeder', 'mulcher', 'baler');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'completed', 'cancelled');

-- Create disposal methods enum  
CREATE TYPE public.disposal_method AS ENUM ('sell_for_profit', 'free_pickup', 'local_recycling');

-- Create residue status enum
CREATE TYPE public.residue_status AS ENUM ('available', 'sold', 'booked', 'disposed');

-- Create profiles table (extends auth.users with additional info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create panchayats table
CREATE TABLE public.panchayats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create farmers table (managed by panchayat admins)
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  panchayat_id UUID NOT NULL REFERENCES public.panchayats(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT,
  village TEXT NOT NULL,
  land_area_acres DECIMAL(8, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create crop residue listings table
CREATE TABLE public.crop_residue_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  panchayat_id UUID NOT NULL REFERENCES public.panchayats(id) ON DELETE CASCADE,
  crop_type crop_type NOT NULL,
  quantity_tons DECIMAL(8, 2) NOT NULL,
  price_per_ton DECIMAL(10, 2),
  disposal_method disposal_method NOT NULL,
  status residue_status NOT NULL DEFAULT 'available',
  location_description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  harvest_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create machine bookings table
CREATE TABLE public.machine_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  panchayat_id UUID NOT NULL REFERENCES public.panchayats(id) ON DELETE CASCADE,
  machine_type machine_type NOT NULL,
  booking_date DATE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create purchases table (buyers purchasing residue)
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  residue_listing_id UUID NOT NULL REFERENCES public.crop_residue_listings(id) ON DELETE CASCADE,
  quantity_tons DECIMAL(8, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panchayats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_residue_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machine_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for panchayats
CREATE POLICY "Panchayat admins can view their panchayat" ON public.panchayats
  FOR SELECT USING (
    admin_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'buyer')
  );

CREATE POLICY "Panchayat admins can manage their panchayat" ON public.panchayats
  FOR ALL USING (admin_id = auth.uid());

-- RLS Policies for farmers  
CREATE POLICY "Farmers and panchayat admins can view farmers" ON public.farmers
  FOR SELECT USING (
    profile_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.panchayats WHERE id = panchayat_id AND admin_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'buyer')
  );

CREATE POLICY "Panchayat admins can manage farmers" ON public.farmers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.panchayats WHERE id = panchayat_id AND admin_id = auth.uid())
  );

-- RLS Policies for crop residue listings
CREATE POLICY "Everyone can view available residue listings" ON public.crop_residue_listings
  FOR SELECT USING (true);

CREATE POLICY "Farmers and panchayat admins can manage residue listings" ON public.crop_residue_listings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.farmers WHERE id = farmer_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.panchayats WHERE id = panchayat_id AND admin_id = auth.uid())
  );

-- RLS Policies for machine bookings
CREATE POLICY "Farmers and panchayat admins can view bookings" ON public.machine_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.farmers WHERE id = farmer_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.panchayats WHERE id = panchayat_id AND admin_id = auth.uid())
  );

CREATE POLICY "Farmers and panchayat admins can manage bookings" ON public.machine_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.farmers WHERE id = farmer_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.panchayats WHERE id = panchayat_id AND admin_id = auth.uid())
  );

-- RLS Policies for purchases
CREATE POLICY "Buyers can view their purchases" ON public.purchases
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can create purchases" ON public.purchases
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their purchases" ON public.purchases
  FOR UPDATE USING (buyer_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_panchayats_updated_at
  BEFORE UPDATE ON public.panchayats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmers_updated_at
  BEFORE UPDATE ON public.farmers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_residue_listings_updated_at
  BEFORE UPDATE ON public.crop_residue_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machine_bookings_updated_at
  BEFORE UPDATE ON public.machine_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();