import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_SECRET_STRIPE_API_KEY}`);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { customer, paymentMethod } = await request.json();

  // PaymentIntent を作成します。
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    automatic_payment_methods: {
      allow_redirects: "never",
      enabled: true,
    },
    confirm: true,
    customer,
    currency: "jpy",
    payment_method: paymentMethod,
  });
  console.log("paymentIntent", JSON.stringify(paymentIntent, null, "  "));

  return NextResponse.json({
    data: {
      id: paymentIntent.id,
    },
    status: "OK",
  });
}
