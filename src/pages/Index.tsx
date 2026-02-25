import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Heart, HandHelping, ArrowRight, ChevronRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-foreground mb-6">
              Smart Food Donation
              <span className="block text-secondary">&amp; Waste Reduction</span>
            </h1>
            <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
              Connecting restaurants, supermarkets, and NGOs to redistribute surplus food — reducing waste and feeding communities across Tamil Nadu.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <>
                  <Link to="/login" className="inline-flex items-center gap-2 rounded-lg gradient-hero px-8 py-3 text-base font-bold text-primary-foreground hover:shadow-lg transition">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Link>
                  <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-8 py-3 text-base font-bold text-foreground hover:bg-foreground/5 transition">
                    Learn More <ChevronRight className="h-5 w-5" />
                  </a>
                </>
              ) : (
                <>
                  {(user.role === 'donor' || user.role === 'admin') && (
                    <Link to="/donor" className="inline-flex items-center gap-2 rounded-lg gradient-hero px-8 py-3 text-base font-bold text-primary-foreground hover:shadow-lg transition">
                      <Heart className="h-5 w-5" /> Donate Food
                    </Link>
                  )}
                  {(user.role === 'requester' || user.role === 'admin') && (
                    <Link to="/requester" className="inline-flex items-center gap-2 rounded-lg gradient-warm px-8 py-3 text-base font-bold text-secondary-foreground hover:shadow-lg transition">
                      <HandHelping className="h-5 w-5" /> Request Food
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Register", desc: "Sign up as Donor, Requester, or Admin" },
              { num: "02", title: "List Food", desc: "Add surplus food availability with details" },
              { num: "03", title: "Match & Accept", desc: "Browse and accept food donations in real-time" },
              { num: "04", title: "Deliver & Impact", desc: "Complete the donation and track impact" },
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-lg border bg-background hover:shadow-md transition">
                <div className="text-4xl font-black text-primary mb-3">{step.num}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-foreground">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: "Active Users", value: "150+" },
              { label: "Donations Completed", value: "1,200+" },
              { label: "Meals Served", value: "50,000+" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-card rounded-lg border">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
                <p className="text-foreground/80 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-foreground">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Raj Kumar", org: "Raj Grand Restaurant", quote: "We used to throw away 30kg of food daily. Now it feeds 50 families!" },
              { name: "Karunai Trust", org: "Charitable Trust", quote: "Food Donation connects us to donors within minutes." },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-lg border bg-background">
                <p className="text-foreground/80 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">Join our community of donors, requesters, and administrators working together to eliminate food waste.</p>
          {!user && (
            <Link to="/login" className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
              Get Started Now <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;

const features = [
  { icon: Utensils, title: "Donate Surplus Food", desc: "Restaurants and supermarkets list surplus food with pickup details, category, and expiry info.", color: "gradient-hero" },
  { icon: MapPin, title: "Real-Time Location", desc: "Map-based matching connects donors with the nearest NGOs. Route mapping on acceptance.", color: "gradient-warm" },
  { icon: BarChart3, title: "Live Analytics", desc: "Admin dashboards track donation trends, warehouse inventory, and community impact in real-time.", color: "gradient-hero" },
  { icon: Truck, title: "Warehouse Management", desc: "Cold storage, dry storage, and mixed facilities tracked with capacity and stock levels.", color: "gradient-warm" },
  { icon: Clock, title: "Instant Matching", desc: "Automated alerts ensure food collection before spoilage. Urgency-based priority system.", color: "gradient-hero" },
  { icon: CheckCircle, title: "Accept & Track", desc: "Accept or reject donations with real-time status updates and route visualization.", color: "gradient-warm" },
];

const steps = [
  { num: "01", title: "Register", desc: "Sign up as a Donor (restaurant, supermarket) or Requester (NGO, shelter)", icon: Users },
  { num: "02", title: "List Food", desc: "Donors add surplus food details — type, quantity, pickup time, location", icon: Utensils },
  { num: "03", title: "Match & Accept", desc: "Requesters browse available donations, accept with route mapping", icon: MapPin },
  { num: "04", title: "Deliver & Impact", desc: "Food reaches those in need. Track your contribution to Zero Hunger", icon: Heart },
];

const testimonials = [
  { name: "Raj Kumar", org: "Raj Grand Restaurant", quote: "We used to throw away 30kg of food daily. Now it feeds 50 families!", avatar: "R" },
  { name: "Karunai Trust", org: "Charitable Trust", quote: "Food Donation connects us to donors within minutes. Our shelter residents never miss a meal.", avatar: "K" },
  { name: "Meena Dairy", org: "Fresh Dairy Farm", quote: "Even perishable items find homes quickly thanks to the cold storage warehouse network.", avatar: "M" },
  { name: "Anbu Illam", org: "Orphanage", quote: "40 children now have nutritious meals every day, thanks to consistent donations.", avatar: "A" },
];

const impactStats = [
  { label: "Tonnes of Food Saved", value: 12, icon: Leaf, color: "text-primary" },
  { label: "CO₂ Emissions Reduced", value: 8, suffix: "t", icon: Globe, color: "text-info" },
  { label: "Communities Served", value: 15, icon: TrendingUp, color: "text-secondary" },
];

const inspirationalQuotes = [
  { text: "If you can't feed a hundred people, then feed just one.", author: "Mother Teresa" },
  { text: "There are people in the world so hungry, that God cannot appear to them except in the form of bread.", author: "Mahatma Gandhi" },
  { text: "The world has enough for everyone's needs, but not everyone's greed.", author: "Mahatma Gandhi" },
];

const Index = () => {
  const { user } = useAuth();
  const { donations } = useDonations();
  const { requests } = useRequests();
  const { profiles } = useProfiles();

  const totalDonations = Array.isArray(donations) ? donations.length : 0;
  const totalRequests = Array.isArray(requests) ? requests.length : 0;
  const totalUsers = Array.isArray(profiles) ? profiles.length : 0;
  const mealsServed = Array.isArray(donations) ? donations.filter(d => d?.status === 'accepted' || d?.status === 'completed').length * 50 : 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Food donation community" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-44">
          <div className="max-w-2xl">
            <div className="animate-fade-in">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary-foreground backdrop-blur-sm">
                <Sparkles className="h-4 w-4" /> Zero Hunger Mission • Real-Time Platform
              </span>
            </div>
            <h1 className="animate-fade-in font-display text-4xl font-black leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Smart Food Donation
              <span className="block text-secondary">& Waste Reduction</span>
            </h1>
            <p className="mt-6 animate-fade-in text-lg text-primary-foreground/80 md:text-xl" style={{ animationDelay: '0.2s' }}>
              Connecting restaurants, supermarkets, and NGOs to redistribute surplus food — reducing waste and feeding communities across Tamil Nadu.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {!user ? (
                <>
                  <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl gradient-hero px-8 py-4 text-base font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-elevated">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Link>
                  <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-2xl border border-primary-foreground/30 bg-primary-foreground/10 px-8 py-4 text-base font-bold text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/20">
                    Learn More <ChevronRight className="h-5 w-5" />
                  </a>
                </>
              ) : (
                <>
                  {(user.role === 'donor' || user.role === 'admin') && (
                    <Link to="/donor" className="inline-flex items-center gap-2 rounded-2xl gradient-hero px-8 py-4 text-base font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105">
                      <Heart className="h-5 w-5" /> Donate Food
                    </Link>
                  )}
                  {(user.role === 'requester' || user.role === 'admin') && (
                    <Link to="/requester" className="inline-flex items-center gap-2 rounded-2xl gradient-warm px-8 py-4 text-base font-bold text-secondary-foreground shadow-elevated transition-all duration-300 hover:scale-105">
                      <HandHelping className="h-5 w-5" /> Request Food
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="inline-flex items-center gap-2 rounded-2xl border border-primary-foreground/30 bg-primary-foreground/10 px-8 py-4 text-base font-bold text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105">
                      <Shield className="h-5 w-5" /> Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {[
              { label: "Active Users", value: totalUsers, icon: Users, suffix: "+", gradient: "from-primary/10 to-primary/5" },
              { label: "Donations", value: totalDonations, icon: Heart, suffix: "", gradient: "from-secondary/10 to-secondary/5" },
              { label: "Meals Served", value: mealsServed, icon: Utensils, suffix: "+", gradient: "from-primary/10 to-primary/5" },
              { label: "Requests", value: totalRequests, icon: HandHelping, suffix: "", gradient: "from-secondary/10 to-secondary/5" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl border bg-card p-5 text-center shadow-elevated hover-lift bg-gradient-to-br ${stat.gradient}`} style={{ animationDelay: `${i * 0.15}s` }}>
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-3xl font-black text-foreground md:text-4xl">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspirational Quote Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 p-10 text-center">
              <Quote className="mx-auto mb-4 h-10 w-10 text-primary/60" />
              <p className="font-display text-xl md:text-2xl font-bold italic text-foreground leading-relaxed">
                "{inspirationalQuotes[0].text}"
              </p>
              <p className="mt-4 text-sm font-bold text-primary">— {inspirationalQuotes[0].author}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-24">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-3xl font-black text-foreground md:text-5xl">How It Works</h2>
          <p className="mx-auto mb-16 max-w-md text-center text-muted-foreground">Four simple steps to make a difference</p>
        </ScrollReveal>
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary md:left-1/2 md:-translate-x-px" />
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 150} className="relative mb-12 last:mb-0">
                <div className={`flex items-start gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl gradient-hero text-xl font-black text-primary-foreground shadow-glow">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className={`flex-1 rounded-2xl border bg-card p-6 shadow-card hover-lift ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">Step {step.num}</span>
                    <h3 className="font-display text-xl font-bold text-foreground mt-1">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-2 text-center font-display text-3xl font-black text-foreground md:text-5xl">Powerful Features</h2>
            <p className="mx-auto mb-16 max-w-md text-center text-muted-foreground">Built with cutting-edge web technology for maximum impact</p>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated">
                  <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${f.color} shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <f.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Second Quote */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />)}
              </div>
              <p className="font-display text-xl md:text-2xl font-bold italic text-foreground leading-relaxed">
                "{inspirationalQuotes[1].text}"
              </p>
              <p className="mt-4 text-sm font-bold text-primary">— {inspirationalQuotes[1].author}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-2 text-center font-display text-3xl font-black text-foreground md:text-5xl">Environmental Impact</h2>
            <p className="mx-auto mb-12 max-w-md text-center text-muted-foreground">Every donation makes a difference for the planet</p>
          </ScrollReveal>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
            {impactStats.map((s, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="rounded-2xl border bg-card p-8 text-center shadow-card hover-lift">
                  <s.icon className={`mx-auto mb-3 h-10 w-10 ${s.color}`} />
                  <p className="text-4xl font-black text-foreground"><AnimatedCounter end={s.value} suffix={s.suffix || "+"} /></p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-2 text-center font-display text-3xl font-black text-foreground md:text-5xl">What Our Community Says</h2>
            <p className="mx-auto mb-16 max-w-md text-center text-muted-foreground">Real stories from donors and receivers</p>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="rounded-2xl border bg-card p-6 shadow-card hover-lift h-full">
                  <div className="mb-4 text-3xl text-primary">❝</div>
                  <p className="mb-6 text-sm italic leading-relaxed text-muted-foreground">{t.quote}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero text-sm font-bold text-primary-foreground">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.org}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-2 text-center font-display text-3xl font-black text-foreground md:text-5xl">Get In Touch</h2>
            <p className="mx-auto mb-12 max-w-md text-center text-muted-foreground">Have questions? Reach out to our team</p>
          </ScrollReveal>
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            <ScrollReveal delay={0}>
              <a href="tel:+919876543210" className="group block rounded-2xl border bg-card p-8 text-center shadow-card hover-lift transition-all">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-glow transition-transform group-hover:scale-110">
                  <Phone className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Call Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">+91 98765 43210</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">Contact Now <ArrowRight className="h-3 w-3" /></span>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <a href="mailto:info@fooddonation.org" className="group block rounded-2xl border bg-card p-8 text-center shadow-card hover-lift transition-all">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-warm shadow-soft transition-transform group-hover:scale-110">
                  <Mail className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Email Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">info@fooddonation.org</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-secondary">Send Email <ArrowRight className="h-3 w-3" /></span>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border bg-card p-8 text-center shadow-card hover-lift transition-all">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(142_70%_45%)] shadow-glow transition-transform group-hover:scale-110">
                  <MessageCircle className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">WhatsApp</h3>
                <p className="mt-2 text-sm text-muted-foreground">Quick message</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">Chat Now <ArrowRight className="h-3 w-3" /></span>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero-wide py-24">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="mb-4 font-display text-3xl font-black text-primary-foreground md:text-5xl">Ready to Make a Difference?</h2>
              <p className="mx-auto mb-4 max-w-md text-lg text-primary-foreground/80">Join the movement to reduce food waste and feed communities.</p>
              <p className="mx-auto mb-10 max-w-lg text-sm italic text-primary-foreground/60">"{inspirationalQuotes[2].text}" — {inspirationalQuotes[2].author}</p>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-card px-10 py-5 text-lg font-bold text-foreground shadow-elevated transition-all duration-300 hover:scale-105">
                Join Food Donation Today <ArrowRight className="h-5 w-5" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-10 text-center font-display text-2xl font-bold text-foreground">Technology Stack</h2>
          </ScrollReveal>
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {["React.js", "TypeScript", "Tailwind CSS", "Lovable Cloud", "Real-time DB", "OpenStreetMap", "Recharts", "Responsive Design"].map((tech, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <span className="rounded-xl border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft hover-lift">{tech}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-dark py-14 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero"><Heart className="h-5 w-5 text-primary-foreground" /></div>
                <span className="font-display text-xl font-bold">Food Donation</span>
              </div>
              <p className="text-sm text-primary-foreground/60">Smart Food Donation and Waste Reduction System — bridging the gap between surplus and scarcity.</p>
            </div>
            <div>
              <h4 className="mb-3 font-display font-bold">Quick Links</h4>
              <div className="space-y-2 text-sm text-primary-foreground/60">
                <Link to="/" className="block hover:text-primary-foreground transition-colors">Home</Link>
                <Link to="/login" className="block hover:text-primary-foreground transition-colors">Login / Sign Up</Link>
                <Link to="/donor" className="block hover:text-primary-foreground transition-colors">Donor Portal</Link>
                <Link to="/requester" className="block hover:text-primary-foreground transition-colors">Requester Portal</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-display font-bold">Contact</h4>
              <div className="space-y-2 text-sm text-primary-foreground/60">
                <a href="mailto:info@fooddonation.org" className="flex items-center gap-2 hover:text-primary-foreground transition-colors"><Mail className="h-4 w-4" /> info@fooddonation.org</a>
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary-foreground transition-colors"><Phone className="h-4 w-4" /> +91 98765 43210</a>
                <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Namakkal-Trichy Road, Thottiam</div>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
            <p>© 2025 Food Donation — Kongunadu College of Engineering & Technology | Batch 18 | Guide: Mr. M. Thangadurai</p>
            <p className="mt-1">Hareshwar M S • Manonmani R • Manimaran R</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
