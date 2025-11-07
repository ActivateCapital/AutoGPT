# Stripe Setup Guide for CreAI Platform

This guide will help you create the necessary products and prices in Stripe for CreAI's subscription tiers.

## Overview

CreAI has 3 paid subscription tiers:
- **Starter (Free)** - No Stripe product needed
- **Professional ($199/month)** - Stripe product required
- **Business ($499/month)** - Stripe product required

## Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to **Products** in the left sidebar

## Step 2: Create Professional Plan Product

### Product Details:
```
Name: CreAI Professional Plan
Description: Full-featured AI automation for professionals and small teams
```

### Features to list:
- 10 active agents
- 5,000 executions/month
- Access to all AI models (GPT-4, Claude, etc.)
- 200+ templates
- Priority support
- Multi-agent orchestration
- Team collaboration (5 seats)
- Custom branding

### Pricing:
1. Click **Add pricing**
2. Select **Recurring**
3. Price: **$199.00 USD**
4. Billing period: **Monthly**
5. Click **Save pricing**

### After Creating:
1. Click on the price you just created
2. Copy the **Price ID** (starts with `price_`)
3. Example: `price_1OxxxxxxxxxxxxxxxxxxxxXX`
4. **Save this for later** - you'll need it for `STRIPE_PROFESSIONAL_PRICE_ID`

## Step 3: Create Business Plan Product

### Product Details:
```
Name: CreAI Business Plan
Description: Advanced AI automation for growing teams and businesses
```

### Features to list:
- 50 active agents
- 25,000 executions/month
- Access to all AI models including custom routing
- All templates
- Dedicated support
- Unlimited multi-agent orchestration
- Team features (20 seats)
- White-label options
- API access
- Cost analytics dashboard

### Pricing:
1. Click **Add pricing**
2. Select **Recurring**
3. Price: **$499.00 USD**
4. Billing period: **Monthly**
5. Click **Save pricing**

### After Creating:
1. Click on the price you just created
2. Copy the **Price ID** (starts with `price_`)
3. Example: `price_1OxxxxxxxxxxxxxxxxxxxxYY`
4. **Save this for later** - you'll need it for `STRIPE_BUSINESS_PRICE_ID`

## Step 4: Set Up Webhook Endpoint

### Purpose:
Webhooks notify your app when subscriptions are created, updated, or cancelled.

### Setup:
1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Endpoint URL: `https://your-app-name.onrender.com/api/stripe/webhook`
   - Replace `your-app-name` with your actual Render app name
4. Description: `CreAI Subscription Webhooks`

### Events to listen for:
Select these specific events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### After Creating:
1. Click on the webhook you just created
2. Click **Reveal** next to "Signing secret"
3. Copy the webhook secret (starts with `whsec_`)
4. **Save this for later** - you'll need it for `STRIPE_WEBHOOK_SECRET`

## Step 5: Environment Variables Summary

Add these to your Render environment variables:

```bash
# Stripe API Keys (from Developers → API keys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Price IDs (from Products → Click product → Copy price ID)
STRIPE_PROFESSIONAL_PRICE_ID=price_1Oxxxxxxxxxxxxxxxxxx
STRIPE_BUSINESS_PRICE_ID=price_1Oxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret (from Developers → Webhooks → Your webhook → Signing secret)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 6: Test Your Setup

### Test in Stripe Dashboard:
1. Go to **Products**
2. You should see:
   - CreAI Professional Plan - $199/month
   - CreAI Business Plan - $499/month

### Test Checkout Flow:
1. Deploy your app to Render
2. Sign in to CreAI
3. Go to `/dashboard/subscription`
4. Click "Upgrade to Professional"
5. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

### Verify Webhook:
1. After test checkout, go to Stripe Dashboard → Webhooks
2. Click your webhook endpoint
3. Check **Events** tab - you should see events delivered
4. Status should be **Succeeded** (green checkmark)

## Step 7: Going Live (Production)

When ready for production:

1. **Switch to Live Mode** in Stripe (toggle in top right)
2. **Recreate the products** in Live Mode (same details)
3. **Get new Price IDs** for live mode
4. **Create new webhook endpoint** with live URL
5. **Update environment variables** with live keys:
   ```bash
   STRIPE_SECRET_KEY=sk_live_xxxxxxxx  # Note: sk_live not sk_test
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxx
   STRIPE_PROFESSIONAL_PRICE_ID=price_live_xxxxxxxx
   STRIPE_BUSINESS_PRICE_ID=price_live_xxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_live_xxxxxxxx
   ```

## Troubleshooting

### Webhook not receiving events:
- Check that webhook URL is correct
- Verify app is deployed and accessible
- Check Stripe Dashboard → Webhooks → Events for errors

### Checkout not working:
- Verify `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set
- Check that Price IDs are correct
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Subscription not showing in app:
- Check webhook is delivering events
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check database - subscription should be created in `Subscription` table

## Quick Checklist

- [ ] Created "CreAI Professional Plan" product in Stripe
- [ ] Created $199/month pricing for Professional
- [ ] Copied Professional Price ID
- [ ] Created "CreAI Business Plan" product in Stripe
- [ ] Created $499/month pricing for Business
- [ ] Copied Business Price ID
- [ ] Created webhook endpoint in Stripe
- [ ] Added 6 events to webhook
- [ ] Copied webhook signing secret
- [ ] Added all 5 environment variables to Render
- [ ] Tested checkout with test card
- [ ] Verified webhook delivered events successfully

## Support

If you encounter issues:
1. Check Stripe logs: Dashboard → Developers → Logs
2. Check webhook attempts: Dashboard → Developers → Webhooks → Your endpoint → Events
3. Check your app logs in Render

---

**Need help?** Check Stripe documentation at https://stripe.com/docs
