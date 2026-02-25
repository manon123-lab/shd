import Layout from "@/components/Layout";
import { Heart, Plus, Package, MapPin, Clock } from "lucide-react";

const DonorPublic = () => {
  const sampleDonations = [
    {
      id: "1",
      donorName: "Raj Grand Restaurant",
      foodType: "Cooked Rice & Vegetables",
      quantity: "50kg",
      pickupTime: "2:00 PM - 3:00 PM",
      address: "Chennai, Tamil Nadu",
      status: "pending",
      category: "cooked",
    },
    {
      id: "2",
      donorName: "Fresh Dairy Farm",
      foodType: "Milk & Paneer",
      quantity: "30L",
      pickupTime: "4:00 PM - 5:00 PM",
      address: "Coimbatore, Tamil Nadu",
      status: "accepted",
      category: "dairy",
    },
    {
      id: "3",
      donorName: "Local Bakery",
      foodType: "Bread & Pastries",
      quantity: "100pcs",
      pickupTime: "6:00 PM - 7:00 PM",
      address: "Bangalore, Karnataka",
      status: "completed",
      category: "bakery",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black text-foreground">Donor Dashboard</h1>
          </div>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Share your surplus food and make a difference in your community. Track donations in real-time.
          </p>
        </div>
      </section>

      {/* Add Donation Button */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:shadow-lg transition">
            <Plus className="h-5 w-5" />
            Add New Donation
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Total Donations", value: "42", color: "text-primary" },
              { label: "Families Served", value: "1,240", color: "text-secondary" },
              { label: "Food Saved (kg)", value: "12,450", color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-lg border">
                <p className={`text-3xl font-black ${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-foreground/80 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donations List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-8 text-foreground">Recent Donations</h2>
          <div className="space-y-6">
            {sampleDonations.map((donation) => (
              <div key={donation.id} className="p-6 rounded-lg border bg-card hover:shadow-md transition">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">{donation.donorName}</h3>
                    </div>
                    <p className="text-lg font-semibold text-foreground/80 mb-3">{donation.foodType}</p>
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p className="flex items-center gap-2">
                        <Package className="h-4 w-4" /> Quantity: {donation.quantity}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Pickup: {donation.pickupTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Location: {donation.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:w-48">
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-center ${
                      donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      donation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition">
                      Track Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Donate?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Sign up as a donor and start sharing surplus food from your business.</p>
          <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-bold hover:shadow-lg transition">
            Get Started
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default DonorPublic;
