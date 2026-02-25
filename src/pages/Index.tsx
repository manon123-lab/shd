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

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card">
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

      {/* Impact Stats */}
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
              { name: "Karunai Trust", org: "Charitable Trust", quote: "Food Donation connects us to donors within minutes. Our shelter residents never miss a meal." },
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

      {/* CTA Section */}
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
