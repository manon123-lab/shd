import Layout from "@/components/Layout";
import { Users, MapPin, Phone, Heart, Search } from "lucide-react";

const RequesterPublic = () => {
  const sampleRequests = [
    {
      id: "1",
      organization: "Sunset Shelter Home",
      people: 150,
      foodNeeded: "Rice, Dal, Vegetables",
      frequency: "Daily",
      location: "Chennai, Tamil Nadu",
      contact: "+91 98765 43210",
      status: "fulfilled",
    },
    {
      id: "2",
      organization: "Hope Community Kitchen",
      people: 80,
      foodNeeded: "Bread, Milk, Fruits",
      frequency: "3x Weekly",
      location: "Coimbatore, Tamil Nadu",
      contact: "+91 87654 32109",
      status: "waiting",
    },
    {
      id: "3",
      organization: "Rural School Meal Program",
      people: 200,
      foodNeeded: "Cooked meals, Vegetables",
      frequency: "5x Weekly",
      location: "Bangalore, Karnataka",
      contact: "+91 76543 21098",
      status: "fulfilled",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Users className="h-8 w-8 text-secondary" />
            <h1 className="text-4xl font-black text-foreground">Request Help</h1>
          </div>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Organizations can request food donations for those in need. Browse available requests and help feed communities.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-foreground/50" />
              <input
                type="text"
                placeholder="Search organizations by name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
              />
            </div>
            <select className="px-4 py-2 rounded-lg border bg-background">
              <option>All Regions</option>
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
              <option>Telangana</option>
            </select>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gradient-to-r from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Active Organizations", value: "18", color: "text-secondary" },
              { label: "People Served", value: "8,650", color: "text-primary" },
              { label: "Requests Fulfilled", value: "92%", color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-lg border">
                <p className={`text-3xl font-black ${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-foreground/80 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Requests */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-8 text-foreground">Current Requests</h2>
          <div className="space-y-6">
            {sampleRequests.map((request) => (
              <div key={request.id} className="p-6 rounded-lg border bg-card hover:shadow-md transition">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-secondary" />
                      <h3 className="text-xl font-bold text-foreground">{request.organization}</h3>
                    </div>
                    <div className="space-y-2 text-sm text-foreground/80 mb-4">
                      <p className="font-semibold text-lg text-foreground/90">{request.foodNeeded}</p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> Serving: {request.people} people
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Location: {request.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Contact: {request.contact}
                      </p>
                      <p className="font-semibold">Frequency: {request.frequency}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:w-48">
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-center ${
                      request.status === 'waiting' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.status === 'waiting' ? 'Waiting' : 'Fulfilled'}
                    </span>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:shadow-lg transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Your Organization Needs Help?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Create a request and connect with donors who want to help.</p>
          <button className="px-8 py-3 bg-secondary-foreground text-secondary rounded-lg font-bold hover:shadow-lg transition">
            Make a Request
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default RequesterPublic;
