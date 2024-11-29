import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
  throw new Error("STRIPE_API_KEY must be defined");
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  typescript: true,
});
