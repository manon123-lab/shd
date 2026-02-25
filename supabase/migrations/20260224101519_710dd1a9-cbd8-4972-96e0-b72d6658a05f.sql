
-- Profiles table for user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'donor' CHECK (role IN ('donor', 'requester', 'admin')),
  phone TEXT DEFAULT '',
  organization TEXT DEFAULT '',
  address TEXT DEFAULT '',
  lat DOUBLE PRECISION DEFAULT 11.0,
  lng DOUBLE PRECISION DEFAULT 78.0,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_org TEXT DEFAULT '',
  food_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  description TEXT DEFAULT '',
  pickup_time TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  category TEXT NOT NULL DEFAULT 'cooked' CHECK (category IN ('cooked', 'raw', 'packaged', 'bakery', 'dairy', 'fruits')),
  expires_in TEXT DEFAULT '',
  accepted_by UUID REFERENCES public.profiles(id),
  accepted_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert donations" ON public.donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update donations" ON public.donations FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete donations" ON public.donations FOR DELETE USING (auth.uid() IS NOT NULL);

-- Food requests table
CREATE TABLE public.food_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_org TEXT DEFAULT '',
  food_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  description TEXT DEFAULT '',
  urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  address TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  beneficiaries INTEGER DEFAULT 0,
  fulfilled_by UUID REFERENCES public.profiles(id),
  fulfilled_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.food_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read food_requests" ON public.food_requests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food_requests" ON public.food_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update food_requests" ON public.food_requests FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete food_requests" ON public.food_requests FOR DELETE USING (auth.uid() IS NOT NULL);

-- Warehouses table
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  manager TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'mixed' CHECK (type IN ('cold', 'dry', 'mixed')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read warehouses" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage warehouses" ON public.warehouses FOR ALL USING (auth.uid() IS NOT NULL);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.warehouses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'donor'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
