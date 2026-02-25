import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', // Use the latest version
});

export async function POST(req: Request) {
  const { jobId, jobTitle } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Job Post: ${jobTitle}`,
              description: '30-day featured listing on Jobsly',
            },
            unit_amount: 2900, // $29.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // We pass the jobId to the success URL so we can identify it later
      success_url: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}/success?session_id={CHECKOUT_SESSION_ID}&jobId=${jobId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}/post`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}