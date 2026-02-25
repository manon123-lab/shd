import Layout from "@/components/Layout";
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react";

const AdminPublic = () => {
  const dashboardStats = [
    { label: "Total Donations", value: "342", change: "+12%", icon: "📦" },
    { label: "Active Users", value: "1,248", change: "+8%", icon: "👥" },
    { label: "People Helped", value: "24,560", change: "+15%", icon: "❤️" },
    { label: "Food Distributed", value: "45.6T", change: "+20%", icon: "🍎" },
  ];

  const recentActivity = [
    { type: "Donation", description: 'New donation from "Grand Restaurant" - 50kg rice', time: "2 hours ago" },
    { type: "Request", description: 'Community Kitchen requested 100kg vegetables', time: "4 hours ago" },
    { type: "Fulfilled", description: 'Donation matched with Sunset Shelter Home', time: "6 hours ago" },
    { type: "User Join", description: 'New donor registered - Fresh Farms Co.', time: "8 hours ago" },
    { type: "Completed", description: 'Monthly food drive exceeded 200% of goal', time: "1 day ago" },
  ];

  const systemStatus = [
    { service: "Donation Service", status: "operational", uptime: "99.98%" },
    { service: "User Management", status: "operational", uptime: "99.95%" },
    { service: "Notifications", status: "operational", uptime: "99.99%" },
    { service: "Payment Gateway", status: "operational", uptime: "99.92%" },
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <BarChart3 className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-black text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-lg text-foreground/80">System overview and platform statistics</p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {dashboardStats.map((stat, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card hover:shadow-md transition">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-foreground/80 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-foreground mb-2">{stat.value}</p>
                <p className="text-sm font-semibold text-green-600">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts & Analysis */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/50 dark:to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Activity Chart */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-foreground">Weekly Activity</h3>
              </div>
              <div className="space-y-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const heights = [65, 70, 55, 85, 90, 75, 60];
                  return (
                    <div key={day} className="flex items-end gap-2">
                      <span className="w-12 text-sm font-semibold text-foreground/80">{day}</span>
                      <div
                        className="bg-blue-500 rounded-t h-16 transition hover:bg-blue-600"
                        style={{ width: `${heights[i] * 2}px` }}
                      />
                      <span className="text-sm text-foreground/80">{heights[i]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Growth Stats */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-bold text-foreground">Year-over-Year Growth</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "User Growth", value: 45, color: "bg-green-500" },
                  { label: "Donations", value: 62, color: "bg-blue-500" },
                  { label: "Requests", value: 38, color: "bg-purple-500" },
                  { label: "Distribution", value: 78, color: "bg-orange-500" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="font-bold text-foreground">{item.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-black mb-6 text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card hover:shadow-md transition flex items-start gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  activity.type === 'Donation' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'Request' ? 'bg-purple-100 text-purple-800' :
                  activity.type === 'Fulfilled' ? 'bg-green-100 text-green-800' :
                  activity.type === 'User Join' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.type}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{activity.description}</p>
                  <p className="text-sm text-foreground/60 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/50 dark:to-gray-900/50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-black mb-6 text-foreground">System Status</h3>
          <div className="grid gap-4">
            {systemStatus.map((system, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg">{system.service}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-foreground/80">{system.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-lg">{system.uptime}</p>
                  <p className="text-xs text-foreground/60">Uptime</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Actions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-black mb-6 text-foreground">Management</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Manage Users", icon: "👥" },
              { label: "View Reports", icon: "📊" },
              { label: "Settings", icon: "⚙️" },
            ].map((action, i) => (
              <button
                key={i}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <p className="font-bold text-foreground">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPublic;
