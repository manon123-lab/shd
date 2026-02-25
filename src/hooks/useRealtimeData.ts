import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { dbDonationToApp, dbRequestToApp, dbProfileToUser, dbWarehouseToApp, type Donation, type FoodRequest, type User, type Warehouse } from '@/lib/store';

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(!isSupabaseConfigured());

  const fetch = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
      if (data) setDonations(data.map(dbDonationToApp));
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    fetch();
    try {
      const channel = supabase.channel('donations-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => fetch())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch (error) {
      console.error('Error setting up donations channel:', error);
    }
  }, []);

  return { donations, loading, refetch: fetch };
}

export function useRequests() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(!isSupabaseConfigured());

  const fetch = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data } = await supabase.from('food_requests').select('*').order('created_at', { ascending: false });
      if (data) setRequests(data.map(dbRequestToApp));
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    fetch();
    try {
      const channel = supabase.channel('requests-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'food_requests' }, () => fetch())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch (error) {
      console.error('Error setting up requests channel:', error);
    }
  }, []);

  return { requests, loading, refetch: fetch };
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(!isSupabaseConfigured());

  const fetch = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) setProfiles(data.map(dbProfileToUser));
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    fetch();
    try {
      const channel = supabase.channel('profiles-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetch())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch (error) {
      console.error('Error setting up profiles channel:', error);
    }
  }, []);

  return { profiles, loading, refetch: fetch };
}

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(!isSupabaseConfigured());

  const fetch = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data } = await supabase.from('warehouses').select('*').order('name');
      if (data) setWarehouses(data.map(dbWarehouseToApp));
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    fetch();
    try {
      const channel = supabase.channel('warehouses-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'warehouses' }, () => fetch())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch (error) {
      console.error('Error setting up warehouses channel:', error);
    }
  }, []);

  return { warehouses, loading, refetch: fetch };
}
