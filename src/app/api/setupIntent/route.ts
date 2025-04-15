import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_SECRET_STRIPE_API_KEY}`);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email } = await request.json();

  // 顧客を作成します。
  const customer = await stripe.customers.create({
    email,
  });
  console.log("customer", customer);

  // SetupIntent を作成します。
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ["card"],
    usage: "off_session",
  });
  console.log("setupIntent", JSON.stringify(setupIntent, null, "  "));

  return NextResponse.json({
    data: {
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
      id: setupIntent.id,
    },
    status: "OK",
  });
}
