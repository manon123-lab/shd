import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create admin user
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@gmail.com",
    password: "admin@123",
    email_confirm: true,
    user_metadata: { name: "Admin", role: "admin" },
  });

  if (error) {
    // If user exists, just return success
    if (error.message.includes("already been registered")) {
      // Update role to admin
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", "admin@gmail.com");
      if (profiles && profiles.length > 0) {
        await supabase.from("profiles").update({ role: "admin" }).eq("email", "admin@gmail.com");
      }
      return new Response(JSON.stringify({ success: true, message: "Admin already exists, role updated" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Update profile role to admin
  if (data.user) {
    await supabase.from("profiles").update({ role: "admin", name: "Admin", organization: "Food Donation Admin", phone: "+91 98765 00000", address: "Thottiam, Tamil Nadu" }).eq("user_id", data.user.id);
  }

  return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
