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

const requesterQuotes = [
  "Hunger is not a problem. It is an obscenity. How wonderful it is that nobody need wait a single moment before starting to improve the world.",
  "There is no beauty in the finest cloth if it makes hunger and unhappiness.",
  "When you have more than you need, build a longer table, not a higher fence.",
];

const Requester = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { requests, refetch: refetchRequests } = useRequests();
  const { donations, refetch: refetchDonations } = useDonations();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [form, setForm] = useState({ foodType: "", quantity: "", description: "", urgency: "medium" as FoodRequest['urgency'], address: "", beneficiaries: 50 });

  if (authLoading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!user || (user.role !== 'requester' && user.role !== 'admin')) { navigate("/login"); return null; }

  const myRequests = requests.filter(r => r.requesterId === user.id || user.role === 'admin');
  const pendingDonations = donations.filter(d => d.status === 'pending');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('food_requests').insert({
      requester_id: user.id, requester_name: user.name, requester_org: user.organization,
      food_type: form.foodType, quantity: form.quantity, description: form.description,
      urgency: form.urgency, address: form.address || user.address,
      lat: user.lat, lng: user.lng, beneficiaries: form.beneficiaries,
    });
    setShowForm(false);
    setForm({ foodType: "", quantity: "", description: "", urgency: "medium", address: "", beneficiaries: 50 });
    toast({ title: "✅ Request submitted!", description: "Donors can now see your request in real-time." });
    refetchRequests();
  };

  const handleDonation = async (don: Donation, action: 'accepted' | 'rejected') => {
    await supabase.from('donations').update({ status: action, accepted_by: user.id, accepted_by_name: user.name }).eq('id', don.id);
    if (action === 'accepted') setSelectedDonation({ ...don, status: action, acceptedBy: user.id, acceptedByName: user.name });
    toast({ title: action === 'accepted' ? "✅ Donation accepted!" : "❌ Donation rejected" });
    refetchDonations();
  };

  const inputClass = "rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-ring";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Quote Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 border border-secondary/20 p-5 text-center animate-fade-in">
          <Quote className="mx-auto mb-2 h-5 w-5 text-secondary/60" />
          <p className="text-sm italic font-medium text-foreground">"{requesterQuotes[Math.floor(Math.random() * requesterQuotes.length)]}"</p>
        </div>

        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-black text-foreground">Requester Dashboard</h1>
            <p className="text-sm text-muted-foreground">Request food and browse available donations • <span className="text-secondary font-semibold">Real-time updates</span></p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-2xl gradient-warm px-6 py-3 text-sm font-bold text-secondary-foreground shadow-soft transition-all duration-300 hover:scale-105">
            <Plus className="h-4 w-4" /> New Request
          </button>
        </div>

        {selectedDonation && user && (
          <div className="mb-8 animate-scale-in rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-primary">🗺️ Route to Pickup Location</h3>
              <button onClick={() => setSelectedDonation(null)} className="rounded-xl p-2 hover:bg-muted"><XCircle className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Picking up from: <strong className="text-foreground">{selectedDonation.donorOrg}</strong></p>
                <p className="text-sm text-muted-foreground">Food: <strong className="text-foreground">{selectedDonation.foodType}</strong> ({selectedDonation.quantity})</p>
                <p className="text-sm text-muted-foreground mt-1">Expires in: <strong className="text-destructive">{selectedDonation.expiresIn}</strong></p>
                <div className="mt-4 flex gap-2">
                  <a href={`https://www.google.com/maps/dir/${user.lat},${user.lng}/${selectedDonation.lat},${selectedDonation.lng}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl gradient-hero px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:scale-105">
                    <MapPin className="h-4 w-4" /> Open in Google Maps
                  </a>
                  <a href={`mailto:${selectedDonation.donorName}?subject=Regarding Donation: ${selectedDonation.foodType}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-info/15 text-foreground px-4 py-2 text-sm font-bold transition-all hover:scale-105">
                    <MessageCircle className="h-4 w-4" /> Contact Donor
                  </a>
                </div>
              </div>
              <RouteMap fromLat={user.lat} fromLng={user.lng} toLat={selectedDonation.lat} toLng={selectedDonation.lng}
                fromLabel={`You: ${user.organization}`} toLabel={`Pickup: ${selectedDonation.donorOrg}`} className="h-64" />
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 rounded-2xl border bg-card p-6 shadow-card animate-scale-in">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">✨ New Food Request</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input value={form.foodType} onChange={e => setForm(f => ({ ...f, foodType: e.target.value }))} placeholder="Food Type Needed" className={inputClass} required />
              <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Quantity (e.g., 100 meals)" className={inputClass} required />
              <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value as any }))} className={inputClass}>
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="critical">🔴 Critical</option>
              </select>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Delivery Address" className={inputClass} required />
              <input value={form.beneficiaries} onChange={e => setForm(f => ({ ...f, beneficiaries: Number(e.target.value) }))} type="number" placeholder="Number of Beneficiaries" className={inputClass} required />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className={`${inputClass} lg:col-span-3`} rows={2} />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="rounded-xl gradient-warm px-6 py-2.5 text-sm font-bold text-secondary-foreground shadow-soft">Submit Request</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-6 py-2.5 text-sm font-medium text-muted-foreground">Cancel</button>
            </div>
          </form>
        )}

        <h2 className="mb-4 font-display text-xl font-bold text-foreground">📋 My Requests ({myRequests.length})</h2>
        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myRequests.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No requests yet.</p>}
          {myRequests.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 80}>
              <div className="rounded-2xl border bg-card p-5 shadow-card hover-lift">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-display text-base font-bold text-foreground">{r.foodType}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mb-3"><UrgencyBadge urgency={r.urgency} /></div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {r.quantity}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {r.address}</div>
                  <div className="flex items-center gap-1.5"><Utensils className="h-3.5 w-3.5" /> {r.beneficiaries} beneficiaries</div>
                </div>
                {r.fulfilledByName && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-primary">✅ Fulfilled by: {r.fulfilledByName}</p>
                    <a href={`mailto:${r.fulfilledByName}?subject=Thank you for fulfilling: ${r.foodType}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-info hover:underline">
                      <MessageCircle className="h-3 w-3" /> Contact Donor
                    </a>
                  </div>
                )}
                <MapEmbed lat={r.lat} lng={r.lng} address={r.address} className="mt-3 h-28" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <h2 className="mb-4 font-display text-xl font-bold text-foreground">🍽️ Available Donations ({pendingDonations.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingDonations.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No available donations at the moment.</p>}
          {pendingDonations.map((d, i) => (
            <ScrollReveal key={d.id} delay={i * 80}>
              <div className="rounded-2xl border bg-card p-5 shadow-card hover-lift">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{d.foodType}</h3>
                    <p className="text-xs text-muted-foreground">{d.donorOrg}</p>
                  </div>
                  <CategoryBadge category={d.category} />
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {d.quantity}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {d.pickupTime}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {d.address}</div>
                  <div className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-destructive" /> Expires: {d.expiresIn}</div>
                </div>
                <MapEmbed lat={d.lat} lng={d.lng} address={d.address} className="mt-3 h-28" />
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleDonation(d, 'accepted')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-105">
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <a href={`mailto:${d.donorName}?subject=Inquiry about: ${d.foodType}&body=Hi ${d.donorName}, I am interested in your donation of ${d.foodType} (${d.quantity}).`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-info/15 text-foreground px-3 py-2.5 text-xs font-bold transition-all hover:scale-105">
                    <MessageCircle className="h-3.5 w-3.5" /> Contact
                  </a>
                  <button onClick={() => handleDonation(d, 'rejected')} className="flex items-center justify-center gap-1.5 rounded-xl bg-destructive py-2.5 px-3 text-xs font-bold text-destructive-foreground transition-all hover:scale-105">
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

export default Requester;
