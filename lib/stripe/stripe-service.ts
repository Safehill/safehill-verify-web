import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance
 * This loads Stripe.js from the official CDN and initializes it with your publishable key
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error(
        'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable'
      );
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
