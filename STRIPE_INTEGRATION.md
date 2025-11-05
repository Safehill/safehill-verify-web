# Stripe Integration Guide

This document explains the Stripe Embedded Checkout integration for the Safehill paywall system.

## Overview

The payment system uses **Stripe Embedded Checkout Sessions** with webhook-based confirmation. The frontend embeds Stripe's checkout form directly in the modal, and payment confirmation is handled asynchronously via webhooks on the backend.

## Architecture

### Payment Flow

1. **User initiates purchase**: Clicks "Purchase" button in the paywall modal
2. **Create Checkout Session**: Frontend calls `POST /collections/checkout-session/{id}` with:
   - `ui_mode: 'embedded'` (for web app)
   - `web_base_url: window.location.origin`
3. **Backend creates session**: Server creates a Stripe Checkout Session and returns `clientSecret`
4. **Display embedded checkout**: Frontend renders Stripe's embedded checkout form using the client secret
5. **User completes payment**: User enters payment details in the embedded Stripe form
6. **Stripe processes payment**: Stripe handles payment processing securely
7. **Webhook notification**: Stripe calls the backend webhook endpoint (`/collections/stripe-webhook`) which grants access to the collection
8. **Poll for access**: Frontend polls `/collections/check-access/{id}` every 2 seconds
9. **Access granted**: When polling detects access is granted, show success message and refresh content

## Frontend Implementation

### Dependencies

```bash
pnpm add @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Stripe Service (`lib/stripe/stripe-service.ts`)

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
```

### API Integration

The frontend uses these DTOs and API methods:

```typescript
// DTOs
export interface CheckoutSessionDTO {
  sessionUrl?: string;      // For hosted mode (mobile)
  clientSecret?: string;    // For embedded mode (web)
  sessionId: string;
  amount: number;
  currency: string;
}

export interface CreateCheckoutSessionRequestDTO {
  ui_mode: 'hosted' | 'embedded';
  web_base_url?: string;  // Required for embedded mode
}

// API Client
createCheckoutSession: async (
  collectionId: string,
  request: CreateCheckoutSessionRequestDTO,
  authedSession: AuthedSession
): Promise<CheckoutSessionDTO> => {
  return await createAuthenticatedRequest<CheckoutSessionDTO>(
    'post',
    `/collections/checkout-session/${collectionId}`,
    authedSession,
    request
  );
}
```

### Embedded Checkout Component

The `PaywallModal` component handles the complete payment flow with four stages:

1. **info**: Shows collection details and pricing
2. **checkout**: Displays Stripe's embedded checkout form
3. **verifying**: Polls for access after payment completion
4. **success**: Shows success message before redirecting

Key features:
- Embedded Stripe checkout form using `EmbeddedCheckoutProvider` and `EmbeddedCheckout`
- Automatic polling for access after payment (max 30 seconds)
- Proper cleanup of polling intervals on unmount
- Error handling with user-friendly messages
- Loading states throughout the flow

## Backend Integration

### API Endpoint

**POST `/collections/checkout-session/{id}`**

Request body:
```json
{
  "ui_mode": "embedded",
  "web_base_url": "https://yourdomain.com"
}
```

Response:
```json
{
  "clientSecret": "cs_test_...",
  "sessionId": "cs_test_...",
  "amount": 25.00,
  "currency": "usd"
}
```

### Backend Implementation Notes

The backend must:
1. Create Stripe Checkout Session with `ui_mode: 'embedded'`
2. Set return URL to `{web_base_url}/payment/return?session_id={CHECKOUT_SESSION_ID}`
3. Include metadata: `collection_id`, `user_id`, `collection_name`
4. Return the `clientSecret` (not `sessionUrl`) for embedded mode

### Webhook Handler

**POST `/collections/stripe-webhook`**

Stripe will call this endpoint when payment events occur (e.g., `checkout.session.completed`). The webhook handler grants access to the collection based on the metadata in the session.

## UI Modes

The system supports two modes:

### Embedded Mode (Web)
- `ui_mode: 'embedded'`
- Checkout form embedded in the modal
- Requires `web_base_url` parameter
- Uses `clientSecret` for initialization
- Better UX, no navigation away from app
- Session preserved throughout payment

### Hosted Mode (Mobile)
- `ui_mode: 'hosted'`
- Redirects to Stripe-hosted page
- Uses deep links: `safehill://payment/success` and `safehill://payment/cancel`
- Returns `sessionUrl` instead of `clientSecret`
- Better for mobile apps (opens in Safari/Chrome)

## Access Verification

After payment completion, the frontend polls the access endpoint:

**GET `/collections/check-access/{id}`**

Response:
```json
{
  "status": "granted",  // or "paywall", "denied"
  "message": "Access granted",
  "price": null,
  "visibility": "public"
}
```

Polling strategy:
- Poll every 2 seconds
- Maximum 15 polls (30 seconds total)
- Stop when `status !== 'paywall'`
- Show timeout error if access not granted within 30 seconds

## Testing

### Test Mode

Use Stripe test mode for development:

1. **Test Data That Works**:

   Individual Account:
   - Legal name: John Doe
   - Email: john.doe@example.com
   - DOB: 01/01/1990
   - SSN: 000-00-0000 (Stripe's magic test value)
   - Address: 123 Main St, San Francisco, CA 94111
   - Phone: 415-555-0123
   
   Bank Account (for payouts):
   - Routing number: 110000000 (Stripe test routing number)
   - Account number: 000123456789

2. **Test Cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication Required: `4000 0025 0000 3155`

3. **Webhook Testing**:
   - Use Stripe CLI: `stripe listen --forward-to localhost:8080/collections/stripe-webhook`
   - Trigger events: `stripe trigger checkout.session.completed`

4. **Test Flow**:
   - Click "Purchase" button
   - Verify embedded checkout loads
   - Enter test card: `4242 4242 4242 4242`
   - Use any future expiry date and CVC
   - Complete payment
   - Verify "Verifying Payment..." screen shows
   - Verify access is granted within a few seconds
   - Verify success message and redirect to collection

## Security Considerations

### Client-Side Security

1. **Always load Stripe.js from official CDN**: Never bundle or self-host
2. **Publishable key only**: Never expose secret keys in frontend code
3. **HTTPS required**: All requests must use HTTPS in production
4. **PCI compliance**: Stripe handles all sensitive payment data (embedded checkout is PCI compliant)

### Best Practices

1. **Client secret security**: Client secrets are single-use and expire
2. **Timeout handling**: Handle cases where webhooks are delayed
3. **Error recovery**: Provide clear error messages and recovery paths
4. **Session management**: Ensure authentication persists through payment flow

## Production Deployment

### Checklist

- [ ] Switch to live Stripe keys (`pk_live_...`, `sk_live_...`)
- [ ] Configure production webhook endpoint
- [ ] Enable HTTPS for all endpoints
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Test full payment flow in production
- [ ] Test mobile app deep links (if using hosted mode)

### Monitoring

Monitor these metrics:
- Checkout session creation success rate
- Payment completion rate
- Access grant success rate
- Polling timeout frequency
- Error rates by stage

## Troubleshooting

### Common Issues

**Client secret not returned**:
- Verify backend is using `ui_mode: 'embedded'`
- Check backend response includes `clientSecret`

**Embedded checkout doesn't load**:
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure Stripe.js loaded from official CDN

**Polling times out**:
- Check webhook is configured correctly
- Verify webhook endpoint is accessible from Stripe
- Review backend logs for webhook errors

**Access not granted**:
- Verify webhook handler grants access correctly
- Check metadata in Stripe dashboard
- Review access check logic in backend

**Session persists through payment**:
- Embedded mode keeps user in the same tab
- Authentication tokens remain valid
- No need for session restoration

## Resources

- [Stripe Embedded Checkout Documentation](https://docs.stripe.com/payments/checkout)
- [Stripe Webhook Documentation](https://docs.stripe.com/webhooks)
- [Stripe Test Cards](https://docs.stripe.com/testing#cards)
- [PCI Compliance Guide](https://stripe.com/docs/security/guide)
