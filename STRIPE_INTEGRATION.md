# Stripe Integration Guide

This document explains how to integrate real Stripe payments into the Safehill paywall system.

## Current Implementation

The current implementation uses a mock Stripe service (`lib/stripe/stripe-service.ts`) that simulates payment processing. This allows for development and testing without requiring real Stripe credentials.

## Real Stripe Integration

To integrate real Stripe payments, follow these steps:

### 1. Install Stripe Dependencies

```bash
pnpm add @stripe/stripe-js
```

### 2. Set Up Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### 3. Replace Mock Stripe Service

Replace the content of `lib/stripe/stripe-service.ts` with real Stripe integration:

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface StripeCheckoutOptions {
  amount: number;
  currency: string;
  collectionId: string;
  collectionName: string;
  successUrl: string;
  cancelUrl: string;
}

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe | null = null;
  private isInitialized = false;

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async initialize(publishableKey: string): Promise<void> {
    if (this.isInitialized) return;
    
    this.stripe = await loadStripe(publishableKey);
    this.isInitialized = true;
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<StripePaymentIntent> {
    // This should call your backend API to create a payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  }

  async redirectToCheckout(options: StripeCheckoutOptions): Promise<{ error?: string }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await this.stripe.redirectToCheckout({
      lineItems: [{
        price_data: {
          currency: options.currency,
          product_data: {
            name: options.collectionName,
          },
          unit_amount: options.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: options.successUrl,
      cancelUrl: options.cancelUrl,
    });

    return { error: error?.message };
  }

  async confirmPayment(clientSecret: string, paymentMethodId?: string): Promise<{ error?: string }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    return { error: error?.message };
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent | null> {
    // This should call your backend API to retrieve the payment intent
    const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
    
    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}

export const stripeService = StripeService.getInstance();
```

### 4. Create Backend API Routes

Create the following API routes in your Next.js app:

#### `/api/create-payment-intent`
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}
```

#### `/api/payment-intent/[id]`
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const paymentIntent = await stripe.paymentIntents.retrieve(id as string);

    res.status(200).json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({ error: 'Failed to retrieve payment intent' });
  }
}
```

### 5. Update Collections API

Update the `collectionsApi.createPaymentIntent` and `collectionsApi.confirmPayment` methods in `lib/api/collections.ts` to call your backend APIs instead of using mock data.

### 6. Handle Webhooks

Set up Stripe webhooks to handle payment events:

```typescript
// /api/webhooks/stripe
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Handle successful payment
      // Grant access to the collection
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
```

## Testing

1. Use Stripe's test mode for development
2. Test with Stripe's test card numbers (e.g., 4242 4242 4242 4242)
3. Use Stripe's webhook testing tool to test webhook events

## Security Considerations

1. Never expose your Stripe secret key in client-side code
2. Always verify webhook signatures
3. Use HTTPS in production
4. Implement proper error handling
5. Store payment records securely
6. Follow PCI compliance guidelines

## Production Deployment

1. Switch to live Stripe keys
2. Set up proper webhook endpoints
3. Configure error monitoring
4. Set up logging for payment events
5. Implement proper backup and recovery procedures
