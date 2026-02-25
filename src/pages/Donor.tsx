import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge, { CategoryBadge, UrgencyBadge } from "@/components/StatusBadge";
import MapEmbed, { RouteMap } from "@/components/MapEmbed";
import ScrollReveal from "@/components/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { useDonations, useRequests } from "@/hooks/useRealtimeData";
import { supabase } from "@/integrations/supabase/client";
import { type FoodRequest, type Donation } from "@/lib/store";
import { Plus, Package, Clock, MapPin, Check, X, Utensils, Timer, XCircle, Loader2, Phone, MessageCircle, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const donorQuotes = [
  "Giving is not just about making a donation. It is about making a difference.",
  "The meaning of life is to find your gift. The purpose of life is to give it away.",
  "We rise by lifting others.",
];

const Donor = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { donations, refetch: refetchDonations } = useDonations();
  const { requests, refetch: refetchRequests } = useRequests();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FoodRequest | null>(null);
  const [form, setForm] = useState({ foodType: "", quantity: "", description: "", pickupTime: "", address: "", category: "cooked" as Donation['category'], expiresIn: "" });

  if (authLoading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!user || (user.role !== 'donor' && user.role !== 'admin')) { navigate("/login"); return null; }

  const myDonations = donations.filter(d => d.donorId === user.id || user.role === 'admin');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('donations').insert({
      donor_id: user.id, donor_name: user.name, donor_org: user.organization,
      food_type: form.foodType, quantity: form.quantity, description: form.description,
      pickup_time: form.pickupTime, address: form.address || user.address,
      lat: user.lat, lng: user.lng, category: form.category, expires_in: form.expiresIn,
    });
    setShowForm(false);
    setForm({ foodType: "", quantity: "", description: "", pickupTime: "", address: "", category: "cooked", expiresIn: "" });
    toast({ title: "✅ Donation added!", description: "Your donation is now visible to all requesters in real-time." });
    refetchDonations();
  };

  const handleRequest = async (req: FoodRequest, action: 'accepted' | 'rejected') => {
    await supabase.from('food_requests').update({ status: action, fulfilled_by: user.id, fulfilled_by_name: user.name }).eq('id', req.id);
    if (action === 'accepted') setSelectedRequest({ ...req, status: action, fulfilledBy: user.id, fulfilledByName: user.name });
    toast({ title: action === 'accepted' ? "✅ Request accepted!" : "❌ Request rejected" });
    refetchRequests();
  };

  const inputClass = "rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-ring";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Quote Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 p-5 text-center animate-fade-in">
          <Quote className="mx-auto mb-2 h-5 w-5 text-primary/60" />
          <p className="text-sm italic font-medium text-foreground">"{donorQuotes[Math.floor(Math.random() * donorQuotes.length)]}"</p>
        </div>

        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-black text-foreground">Donor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your food donations and view incoming requests • <span className="text-primary font-semibold">Real-time updates</span></p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-2xl gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105">
            <Plus className="h-4 w-4" /> Add Donation
          </button>
        </div>

        {selectedRequest && user && (
          <div className="mb-8 animate-scale-in rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-primary">🗺️ Route to Requester</h3>
              <button onClick={() => setSelectedRequest(null)} className="rounded-xl p-2 hover:bg-muted"><XCircle className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Delivering to: <strong className="text-foreground">{selectedRequest.requesterOrg}</strong></p>
                <p className="text-sm text-muted-foreground">Food needed: <strong className="text-foreground">{selectedRequest.foodType}</strong> ({selectedRequest.quantity})</p>
                <p className="text-sm text-muted-foreground mt-1">Beneficiaries: <strong className="text-foreground">{selectedRequest.beneficiaries} people</strong></p>
                <div className="mt-4 flex gap-2">
                  <a href={`https://www.google.com/maps/dir/${user.lat},${user.lng}/${selectedRequest.lat},${selectedRequest.lng}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl gradient-hero px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:scale-105">
                    <MapPin className="h-4 w-4" /> Open in Google Maps
                  </a>
                </div>
              </div>
              <RouteMap fromLat={user.lat} fromLng={user.lng} toLat={selectedRequest.lat} toLng={selectedRequest.lng}
                fromLabel={`You: ${user.organization}`} toLabel={`To: ${selectedRequest.requesterOrg}`} className="h-64" />
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 rounded-2xl border bg-card p-6 shadow-card animate-scale-in">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">✨ New Donation</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input value={form.foodType} onChange={e => setForm(f => ({ ...f, foodType: e.target.value }))} placeholder="Food Type (e.g., Biryani)" className={inputClass} required />
              <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Quantity (e.g., 50 meals)" className={inputClass} required />
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))} className={inputClass}>
                <option value="cooked">🍛 Cooked Food</option>
                <option value="raw">🥕 Raw Ingredients</option>
                <option value="packaged">📦 Packaged</option>
                <option value="bakery">🍞 Bakery</option>
                <option value="dairy">🥛 Dairy</option>
                <option value="fruits">🍎 Fruits</option>
              </select>
              <input value={form.pickupTime} onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} type="datetime-local" className={inputClass} required />
              <input value={form.expiresIn} onChange={e => setForm(f => ({ ...f, expiresIn: e.target.value }))} placeholder="Expires in (e.g., 4 hours)" className={inputClass} required />
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Pickup Address" className={inputClass} required />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className={`${inputClass} lg:col-span-3`} rows={2} />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="rounded-xl gradient-hero px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-soft">Submit Donation</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-6 py-2.5 text-sm font-medium text-muted-foreground">Cancel</button>
            </div>
          </form>
        )}

        <h2 className="mb-4 font-display text-xl font-bold text-foreground">📋 My Donations ({myDonations.length})</h2>
        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myDonations.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No donations yet. Add your first one!</p>}
          {myDonations.map((d, i) => (
            <ScrollReveal key={d.id} delay={i * 80}>
              <div className="rounded-2xl border bg-card p-5 shadow-card hover-lift">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{d.foodType}</h3>
                    <p className="text-xs text-muted-foreground">{d.donorOrg}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <CategoryBadge category={d.category} />
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"><Timer className="h-3 w-3" />{d.expiresIn}</span>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {d.quantity}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {d.pickupTime}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {d.address}</div>
                </div>
                {d.acceptedByName && <p className="mt-2 text-xs font-semibold text-primary">✅ Accepted by: {d.acceptedByName}</p>}
                <MapEmbed lat={d.lat} lng={d.lng} address={d.address} className="mt-3 h-32" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <h2 className="mb-4 font-display text-xl font-bold text-foreground">📨 Incoming Food Requests ({pendingRequests.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No pending requests at the moment.</p>}
          {pendingRequests.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 80}>
              <div className="rounded-2xl border bg-card p-5 shadow-card hover-lift">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{r.foodType}</h3>
                    <p className="text-xs text-muted-foreground">{r.requesterOrg}</p>
                  </div>
                  <UrgencyBadge urgency={r.urgency} />
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {r.quantity}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {r.address}</div>
                  <div className="flex items-center gap-1.5"><Utensils className="h-3.5 w-3.5" /> {r.beneficiaries} beneficiaries</div>
                </div>
                {r.description && <p className="mt-2 text-xs text-muted-foreground italic">{r.description}</p>}
                <MapEmbed lat={r.lat} lng={r.lng} address={r.address} className="mt-3 h-28" />
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleRequest(r, 'accepted')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-105">
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <a href={`mailto:${r.requesterName}?subject=Regarding Food Request: ${r.foodType}`} className="flex items-center justify-center gap-1.5 rounded-xl bg-info/15 text-foreground px-3 py-2.5 text-xs font-bold transition-all hover:scale-105">
                    <MessageCircle className="h-3.5 w-3.5" /> Contact
                  </a>
                  <button onClick={() => handleRequest(r, 'rejected')} className="flex items-center justify-center gap-1.5 rounded-xl bg-destructive py-2.5 px-3 text-xs font-bold text-destructive-foreground transition-all hover:scale-105">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Donor;
