import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan") || "basic";

    const priceMap: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_SUB_BASIC_1199 as string,
      standard: process.env.STRIPE_PRICE_SUB_STD_1999 as string,
      pro: process.env.STRIPE_PRICE_SUB_PRO_3999 as string,
      oneoff: process.env.STRIPE_PRICE_ONEOFF_CHF_999 as string
    };

    const mode = plan === "oneoff" ? "payment" : "subscription";
    const price = priceMap[plan] || priceMap.basic;

    const session = await stripe.checkout.sessions.create({
      mode: mode as "payment" | "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=cancel`,
      currency: "chf",
      billing_address_collection: "auto",
      allow_promotion_codes: true
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  }catch(e:any){
    return NextResponse.json({ error: e?.message || "stripe_error" }, { status: 500 });
  }
}
