import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJS() {
  const stripeJS = await loadStripe(
    String(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  );

  return stripeJS;
}
