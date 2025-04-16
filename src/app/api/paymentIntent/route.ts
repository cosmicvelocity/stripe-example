import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_SECRET_STRIPE_API_KEY}`);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { customer, paymentMethod } = await request.json();

  try {
    // PaymentIntent を作成します。
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: true,
      customer,
      currency: "jpy",
      off_session: true,
      payment_method: paymentMethod,
    });
    console.log("paymentIntent", JSON.stringify(paymentIntent, null, "  "));

    return NextResponse.json({
      data: {
        id: paymentIntent.id,
      },
      status: "OK",
    });
  } catch (err) {
    console.log("Error", JSON.stringify(err, null, "  "));

    return NextResponse.json({
      data: {},
      status: "NG",
    });
  }
}
