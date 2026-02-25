import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge, { CategoryBadge, UrgencyBadge } from "@/components/StatusBadge";
import MapEmbed from "@/components/MapEmbed";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollReveal from "@/components/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { useDonations, useRequests, useProfiles, useWarehouses } from "@/hooks/useRealtimeData";
import { supabase } from "@/integrations/supabase/client";
import { type Warehouse } from "@/lib/store";
import { Users, Heart, HandHelping, Trash2, Check, X, BarChart3, TrendingUp, Package, Warehouse as WarehouseIcon, MapPin, Phone, Loader2, Activity, MessageCircle, Mail, Quote } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(142,52%,36%)", "hsl(30,85%,55%)", "hsl(0,72%,51%)", "hsl(38,92%,50%)", "hsl(210,80%,55%)"];
const warehouseTypeColors: Record<string, string> = { cold: "bg-info/15 text-foreground", dry: "bg-warning/15 text-warning", mixed: "bg-primary/15 text-primary" };
const warehouseStatusColors: Record<string, string> = { active: "bg-primary/15 text-primary", full: "bg-warning/15 text-warning", maintenance: "bg-destructive/15 text-destructive" };

const adminQuote = "Alone we can do so little; together we can do so much. — Helen Keller";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profiles, refetch: refetchProfiles } = useProfiles();
  const { donations, refetch: refetchDonations } = useDonations();
  const { requests, refetch: refetchRequests } = useRequests();
  const { warehouses } = useWarehouses();
  const { toast } = useToast();
  const [tab, setTab] = useState<'overview' | 'users' | 'donations' | 'requests' | 'warehouses'>('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  if (authLoading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!user || user.role !== 'admin') { navigate("/login"); return null; }

  const donationStatusData = [
    { name: "Pending", value: donations.filter(d => d.status === 'pending').length },
    { name: "Accepted", value: donations.filter(d => d.status === 'accepted').length },
    { name: "Rejected", value: donations.filter(d => d.status === 'rejected').length },
    { name: "Completed", value: donations.filter(d => d.status === 'completed').length },
  ].filter(d => d.value > 0);

  const categoryData = ['cooked', 'raw', 'packaged', 'bakery', 'dairy', 'fruits'].map(c => ({
    name: c.charAt(0).toUpperCase() + c.slice(1), count: donations.filter(d => d.category === c).length,
  })).filter(d => d.count > 0);

  const roleData = [
    { name: "Donors", count: profiles.filter(u => u.role === 'donor').length },
    { name: "Requesters", count: profiles.filter(u => u.role === 'requester').length },
    { name: "Admins", count: profiles.filter(u => u.role === 'admin').length },
  ];

  const urgencyData = [
    { name: "Low", count: requests.filter(r => r.urgency === 'low').length },
    { name: "Medium", count: requests.filter(r => r.urgency === 'medium').length },
    { name: "High", count: requests.filter(r => r.urgency === 'high').length },
    { name: "Critical", count: requests.filter(r => r.urgency === 'critical').length },
  ];

  const trendData = [
    { month: "Jan", donations: 12, requests: 8 }, { month: "Feb", donations: 19, requests: 14 },
    { month: "Mar", donations: 25, requests: 20 }, { month: "Apr", donations: 22, requests: 18 },
    { month: "May", donations: 30, requests: 25 }, { month: "Jun", donations: 35, requests: 28 },
  ];

  const totalBeneficiaries = requests.reduce((s, r) => s + r.beneficiaries, 0);
  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  const totalStock = warehouses.reduce((s, w) => s + w.currentStock, 0);

  const stats = [
    { label: "Total Users", value: profiles.length, icon: Users, color: "gradient-hero" },
    { label: "Donations", value: donations.length, icon: Heart, color: "gradient-warm" },
    { label: "Requests", value: requests.length, icon: HandHelping, color: "gradient-hero" },
    { label: "Beneficiaries", value: totalBeneficiaries, icon: TrendingUp, color: "gradient-warm" },
    { label: "Warehouses", value: warehouses.length, icon: WarehouseIcon, color: "gradient-hero" },
    { label: "Storage Used", value: totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0, icon: Package, color: "gradient-warm", suffix: "%" },
  ];

  const tabs = [
    { key: 'overview' as const, label: 'Analytics', icon: BarChart3 },
    { key: 'users' as const, label: 'Users', icon: Users },
    { key: 'donations' as const, label: 'Donations', icon: Heart },
    { key: 'requests' as const, label: 'Requests', icon: HandHelping },
    { key: 'warehouses' as const, label: 'Warehouses', icon: WarehouseIcon },
  ];

  const handleDeleteProfile = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    toast({ title: "User deleted" });
    refetchProfiles();
  };

  const handleUpdateDonation = async (id: string, status: string) => {
    await supabase.from('donations').update({ status }).eq('id', id);
    refetchDonations();
  };

  const handleDeleteDonation = async (id: string) => {
    await supabase.from('donations').delete().eq('id', id);
    refetchDonations();
  };

  const handleUpdateRequest = async (id: string, status: string) => {
    await supabase.from('food_requests').update({ status }).eq('id', id);
    refetchRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    await supabase.from('food_requests').delete().eq('id', id);
    refetchRequests();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Quote Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 p-4 text-center animate-fade-in">
          <Quote className="mx-auto mb-1 h-4 w-4 text-primary/60" />
          <p className="text-sm italic font-medium text-foreground">{adminQuote}</p>
        </div>

        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-black text-foreground">Admin Control Panel</h1>
          <p className="text-sm text-muted-foreground">Full system oversight with <span className="text-primary font-semibold">real-time analytics</span> • <Activity className="inline h-3.5 w-3.5 text-primary animate-pulse" /> Live</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 shadow-card hover-lift" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${s.color} shadow-soft`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-black text-foreground"><AnimatedCounter end={s.value} suffix={s.suffix || ""} /></p>
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-muted p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-3 text-sm font-bold transition-all duration-200 ${tab === t.key ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="h-4 w-4" /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              <ScrollReveal>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">📊 Donation Status</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={donationStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {donationStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">📈 Donation Trends</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(142,52%,36%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(142,52%,36%)" stopOpacity={0} /></linearGradient>
                        <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(30,85%,55%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(30,85%,55%)" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                      <Area type="monotone" dataKey="donations" stroke="hsl(142,52%,36%)" fillOpacity={1} fill="url(#colorDon)" strokeWidth={2} />
                      <Area type="monotone" dataKey="requests" stroke="hsl(30,85%,55%)" fillOpacity={1} fill="url(#colorReq)" strokeWidth={2} />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <ScrollReveal delay={200}>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">👥 Users by Role</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={roleData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,88%)" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="hsl(142,52%,36%)" radius={[8, 8, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">🍽️ By Category</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={categoryData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,88%)" /><XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} /><Tooltip /><Bar dataKey="count" fill="hsl(30,85%,55%)" radius={[0, 8, 8, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">🚨 Request Urgency</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart><Pie data={urgencyData.filter(d => d.count > 0)} cx="50%" cy="50%" outerRadius={80} dataKey="count" strokeWidth={0}>{urgencyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={200}>
              <div className="rounded-2xl border bg-card p-6 shadow-card">
                <h3 className="mb-4 font-display text-lg font-bold text-foreground">🏭 Warehouse Capacity Overview</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {warehouses.map(w => (
                    <div key={w.id} className="rounded-xl border bg-background p-4 hover-lift">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-foreground">{w.name}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${warehouseStatusColors[w.status]}`}>{w.status}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{w.currentStock.toLocaleString()} / {w.capacity.toLocaleString()} kg</span>
                          <span>{w.capacity > 0 ? Math.round((w.currentStock / w.capacity) * 100) : 0}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${w.capacity > 0 && w.currentStock / w.capacity > 0.9 ? 'bg-destructive' : w.capacity > 0 && w.currentStock / w.capacity > 0.7 ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${w.capacity > 0 ? Math.round((w.currentStock / w.capacity) * 100) : 0}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${warehouseTypeColors[w.type]}`}>{w.type === 'cold' ? '❄️' : w.type === 'dry' ? '☀️' : '🔄'} {w.type}</span>
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{w.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {tab === 'users' && (
          <div className="animate-fade-in overflow-x-auto rounded-2xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50">
                <th className="px-4 py-3.5 text-left font-bold text-foreground">User</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Email</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Role</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Organization</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Phone</th>
                <th className="px-4 py-3.5 text-right font-bold text-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {profiles.map(u => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-hero text-xs font-bold text-primary-foreground">{u.name.charAt(0)}</div>
                        <span className="font-semibold text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground capitalize">{u.role}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{u.organization}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`mailto:${u.email}?subject=Message from Food Donation Admin`} className="rounded-lg p-1.5 text-info hover:bg-info/10 transition-colors" title="Email"><Mail className="h-4 w-4" /></a>
                        {u.phone && <a href={`tel:${u.phone}`} className="rounded-lg p-1.5 text-primary hover:bg-primary/10 transition-colors" title="Call"><Phone className="h-4 w-4" /></a>}
                        <button onClick={() => handleDeleteProfile(u.id)} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'donations' && (
          <div className="animate-fade-in overflow-x-auto rounded-2xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50">
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Food</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Donor</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Category</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Qty</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Status</th>
                <th className="px-4 py-3.5 text-right font-bold text-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{d.foodType}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.donorName}</td>
                    <td className="px-4 py-3"><CategoryBadge category={d.category} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{d.quantity}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`mailto:${d.donorName}?subject=About donation: ${d.foodType}`} className="rounded-lg p-1.5 text-info hover:bg-info/10 transition-colors" title="Contact Donor"><MessageCircle className="h-4 w-4" /></a>
                        {d.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateDonation(d.id, 'accepted')} className="rounded-lg p-1.5 text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                            <button onClick={() => handleUpdateDonation(d.id, 'rejected')} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleDeleteDonation(d.id)} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'requests' && (
          <div className="animate-fade-in overflow-x-auto rounded-2xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50">
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Food Type</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Requester</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Urgency</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Beneficiaries</th>
                <th className="px-4 py-3.5 text-left font-bold text-foreground">Status</th>
                <th className="px-4 py-3.5 text-right font-bold text-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{r.foodType}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.requesterName}</td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={r.urgency} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.beneficiaries}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`mailto:${r.requesterName}?subject=About food request: ${r.foodType}`} className="rounded-lg p-1.5 text-info hover:bg-info/10 transition-colors" title="Contact Requester"><MessageCircle className="h-4 w-4" /></a>
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateRequest(r.id, 'accepted')} className="rounded-lg p-1.5 text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                            <button onClick={() => handleUpdateRequest(r.id, 'rejected')} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleDeleteRequest(r.id)} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'warehouses' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {warehouses.map((w, i) => (
                <ScrollReveal key={w.id} delay={i * 100}>
                  <div className={`rounded-2xl border bg-card p-6 shadow-card hover-lift cursor-pointer ${selectedWarehouse?.id === w.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedWarehouse(selectedWarehouse?.id === w.id ? null : w)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-base font-bold text-foreground">{w.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{w.address}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${warehouseStatusColors[w.status]}`}>{w.status}</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Capacity</span>
                        <span className="font-bold text-foreground">{w.currentStock.toLocaleString()} / {w.capacity.toLocaleString()} kg</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${w.capacity > 0 && w.currentStock / w.capacity > 0.9 ? 'bg-destructive' : w.capacity > 0 && w.currentStock / w.capacity > 0.7 ? 'bg-warning' : 'bg-primary'}`}
                          style={{ width: `${w.capacity > 0 ? Math.round((w.currentStock / w.capacity) * 100) : 0}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${warehouseTypeColors[w.type]}`}>{w.type === 'cold' ? '❄️ Cold' : w.type === 'dry' ? '☀️ Dry' : '🔄 Mixed'}</span>
                      <span className="flex items-center gap-0.5 justify-end"><Phone className="h-3 w-3" />{w.phone}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Manager: <strong className="text-foreground">{w.manager}</strong></p>
                    {/* Contact buttons */}
                    <div className="mt-3 flex gap-2">
                      <a href={`tel:${w.phone}`} onClick={e => e.stopPropagation()} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20">
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                      <a href={`mailto:warehouse-${w.name.toLowerCase().replace(/\s/g, '')}@fooddonation.org?subject=Inquiry about ${w.name}`} onClick={e => e.stopPropagation()} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-info/10 py-2 text-xs font-bold text-foreground transition-all hover:bg-info/20">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {selectedWarehouse && (
              <div className="animate-scale-in rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-elevated">
                <h3 className="mb-4 font-display text-lg font-bold text-primary">📍 {selectedWarehouse.name} — Location</h3>
                <MapEmbed lat={selectedWarehouse.lat} lng={selectedWarehouse.lng} address={selectedWarehouse.address} className="h-72" />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
