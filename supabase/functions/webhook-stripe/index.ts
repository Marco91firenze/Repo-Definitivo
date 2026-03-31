import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://aicvscanner.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

interface CheckoutSessionCompletedEvent {
  type: "checkout.session.completed";
  data: {
    object: {
      id: string;
      customer_email: string;
      metadata: {
        userId: string;
        packageSize: "batch_100" | "batch_1000";
        credits: string;
      };
      payment_intent: string;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const signature = req.headers.get("Stripe-Signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.text();

    // Verify Stripe signature
    const stripe = (await import("npm:stripe@17.7.0")).default;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey || !stripeWebhookSecret) {
      console.error("Stripe configuration missing");
      return new Response(
        JSON.stringify({ error: "Stripe configuration missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripeClient = new stripe(stripeSecretKey);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return new Response(
        JSON.stringify({ error: "Webhook verification failed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = (event as CheckoutSessionCompletedEvent).data.object;
      const { userId, packageSize, credits } = session.metadata;

      if (!userId || !credits) {
        return new Response(
          JSON.stringify({ error: "Missing metadata" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update company credits in Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Supabase configuration missing");
        return new Response(
          JSON.stringify({ error: "Supabase configuration missing" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const supabase = (await import("npm:@supabase/supabase-js@2.57.4"))
        .createClient(
          supabaseUrl,
          supabaseServiceKey
        );

      // Get current credits
      const { data: company } = await supabase
        .from("companies")
        .select("free_cvs_remaining, total_credits_purchased")
        .eq("id", userId)
        .maybeSingle();

      if (!company) {
        return new Response(
          JSON.stringify({ error: "Company not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Add credits and record purchase
      const newCredits = (company.free_cvs_remaining || 0) + parseInt(credits);
      const totalPurchased = (company.total_credits_purchased || 0) + parseInt(credits);

      // Update company
      const { error: updateError } = await supabase
        .from("companies")
        .update({
          free_cvs_remaining: newCredits,
          total_credits_purchased: totalPurchased,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Failed to update company:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update credits" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Record purchase
      const { error: purchaseError } = await supabase
        .from("credit_purchases")
        .insert({
          company_id: userId,
          package_id: packageSize === "batch_100" ? 100 : 1000,
          cvs_purchased: parseInt(credits),
          price_eur: packageSize === "batch_100" ? 50 : 300,
          stripe_payment_id: session.payment_intent,
          status: "completed",
          completed_at: new Date().toISOString(),
        });

      if (purchaseError) {
        console.error("Failed to record purchase:", purchaseError);
      }

      return new Response(
        JSON.stringify({ success: true, newCredits }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return success for other event types
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
