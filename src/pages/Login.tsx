import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, LogIn, UserPlus, ArrowRight, Quote } from "lucide-react";
import { type UserRole } from "@/lib/store";

const quotes = [
  { text: "No one has ever become poor by giving.", author: "Anne Frank" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
];

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quoteIdx] = useState(Math.floor(Math.random() * quotes.length));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', authUser.id).maybeSingle();
      const userRole = profile?.role || 'donor';
      navigate(userRole === 'admin' ? '/admin' : userRole === 'donor' ? '/donor' : '/requester');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !org || !address) { setError("Please fill all fields."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role } }
    });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles')
        .update({ phone, organization: org, address, lat: 11.0 + Math.random(), lng: 78.0 + Math.random() })
        .eq('user_id', data.user.id);
    }
    navigate(role === 'admin' ? '/admin' : role === 'donor' ? '/donor' : '/requester');
    setLoading(false);
  };

  const inputClass = "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-ring focus:border-primary";

  return (
    <div className="flex min-h-screen">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-hero-wide">
        <div className="flex flex-col justify-center px-16 text-primary-foreground">
          <Heart className="h-12 w-12 mb-6 animate-float" />
          <h1 className="font-display text-4xl font-black leading-tight mb-4">Share Food,<br />Share Love</h1>
          <p className="text-lg text-primary-foreground/80 mb-8">Join the mission to reduce food waste and feed communities across Tamil Nadu.</p>
          <div className="space-y-4">
            {["Register as Donor or Requester", "List or request surplus food", "Track donations with real-time maps", "Make an impact — feed the hungry"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-bold">{i + 1}</div>
                <span className="text-sm font-medium text-primary-foreground/90">{s}</span>
              </div>
            ))}
          </div>
          {/* Inspirational Quote */}
          <div className="mt-10 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm p-5 border border-primary-foreground/20">
            <Quote className="h-6 w-6 text-primary-foreground/60 mb-2" />
            <p className="text-sm italic text-primary-foreground/90 leading-relaxed">"{quotes[quoteIdx].text}"</p>
            <p className="mt-2 text-xs font-bold text-primary-foreground/70">— {quotes[quoteIdx].author}</p>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary-foreground/5 blur-xl" />
        <div className="absolute top-20 right-20 h-24 w-24 rounded-full bg-primary-foreground/5 blur-lg" />
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md animate-scale-in">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero shadow-glow">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup ? "Join the food donation network" : "Login to your Food Donation account"}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="mb-5 flex rounded-xl bg-muted p-1">
              <button onClick={() => { setIsSignup(false); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${!isSignup ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}>
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button onClick={() => { setIsSignup(true); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${isSignup ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}>
                <UserPlus className="h-4 w-4" /> Sign Up
              </button>
            </div>

            {error && <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive animate-fade-in">{error}</div>}

            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-3">
              {isSignup && (
                <>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className={inputClass} />
                  <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={inputClass}>
                    <option value="donor">🍽️ Donor (Restaurant / Supermarket)</option>
                    <option value="requester">🤲 Requester (NGO / Shelter)</option>
                  </select>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className={inputClass} />
                  <input value={org} onChange={e => setOrg(e.target.value)} placeholder="Organization Name" className={inputClass} />
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className={inputClass} />
                </>
              )}
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className={inputClass} required />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (min 6 chars)" className={inputClass} required />
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {!isSignup && (
              <>
                <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3">
                  <p className="text-xs font-bold text-foreground mb-1">🔐 Admin Login</p>
                  <p className="text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">admin@gmail.com</span></p>
                  <p className="text-xs text-muted-foreground">Password: <span className="font-mono text-foreground">admin@123</span></p>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Don't have an account? <button onClick={() => setIsSignup(true)} className="text-primary font-bold hover:underline">Sign up here</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
