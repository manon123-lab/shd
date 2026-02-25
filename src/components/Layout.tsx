import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, LogOut, Heart, HandHelping, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, roles: ['donor', 'requester', 'admin'] },
    { path: "/donor", label: "Donor", icon: Heart, roles: ['donor', 'admin'] },
    { path: "/requester", label: "Requester", icon: HandHelping, roles: ['requester', 'admin'] },
    { path: "/admin", label: "Admin", icon: Shield, roles: ['admin'] },
  ];

  const filtered = user ? navItems.filter(n => n.roles.includes(user.role)) : [navItems[0]];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl shadow-soft">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-xl font-extrabold text-foreground">Food Donation</span>
              <span className="hidden text-[10px] text-muted-foreground sm:block">Zero Hunger Mission</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {filtered.map(n => (
              <Link key={n.path} to={n.path}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === n.path ? "bg-primary/10 text-primary shadow-soft" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-hero text-xs font-bold text-primary-foreground">{user.name.charAt(0)}</div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
                    <span className="rounded-full bg-accent px-1.5 py-0 text-[10px] font-bold text-accent-foreground uppercase">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 rounded-xl gradient-hero px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:scale-105">
                Login
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 hover:bg-muted md:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="animate-fade-in border-t bg-card p-4 md:hidden">
            {filtered.map(n => (
              <Link key={n.path} to={n.path} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${location.pathname === n.path ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary">
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </header>
      <main className="animate-fade-in">{children}</main>
    </div>
  );
};

export default Layout;
