# Stripe Quick Reference - CreAI Platform

## Products to Create in Stripe Dashboard

### 1️⃣ Professional Plan

```
Product Name: CreAI Professional Plan
Price: $199/month (recurring)
Currency: USD

Features:
• 10 active agents
• 5,000 executions/month
• All AI models (GPT-4, Claude Sonnet, Claude Haiku, etc.)
• 200+ templates
• 200 integrations
• Priority support
• Multi-agent orchestration
• Team collaboration (5 seats)
• Custom branding

Metadata (optional):
maxAgents: 10
maxExecutions: 5000
tier: professional
```

**→ Copy the Price ID that starts with `price_`**

---

### 2️⃣ Business Plan

```
Product Name: CreAI Business Plan
Price: $499/month (recurring)
Currency: USD

Features:
• 50 active agents
• 25,000 executions/month
• All AI models + smart routing
• All templates
• 500+ integrations
• Dedicated support
• Unlimited multi-agent orchestration
• Team features (20 seats)
• White-label options
• API access
• Cost analytics dashboard

Metadata (optional):
maxAgents: 50
maxExecutions: 25000
tier: business
```

**→ Copy the Price ID that starts with `price_`**

---

## Environment Variables Needed

```bash
# From Stripe Dashboard → Developers → API keys
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# From Products (after creating above)
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...

# From Webhook endpoint (after creating)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Webhook Configuration

**Endpoint URL:**
```
https://your-app.onrender.com/api/stripe/webhook
```

**Events to select:**
```
✓ checkout.session.completed
✓ customer.subscription.created
✓ customer.subscription.updated
✓ customer.subscription.deleted
✓ invoice.payment_succeeded
✓ invoice.payment_failed
```

---

## Test Cards

**Successful payment:**
```
Card: 4242 4242 4242 4242
Exp: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

**Declined payment (test failure):**
```
Card: 4000 0000 0000 0002
```

**Requires 3D Secure:**
```
Card: 4000 0027 6000 3184
```

---

## Quick Test Checklist

After setup, test this flow:

1. [ ] Go to https://your-app.onrender.com/dashboard/subscription
2. [ ] Click "Upgrade to Professional"
3. [ ] Fill in test card `4242 4242 4242 4242`
4. [ ] Complete checkout
5. [ ] Verify redirect back to dashboard
6. [ ] Check subscription shows as "Professional" plan
7. [ ] Check Stripe Dashboard shows successful subscription
8. [ ] Check webhook received `checkout.session.completed` event
9. [ ] Check database has subscription record with correct limits

---

## Expected Database Values

After successful checkout, your `Subscription` table should have:

```
plan: "professional" (or "business")
status: "active"
maxAgents: 10 (or 50 for business)
maxExecutions: 5000 (or 25000 for business)
stripeSubscriptionId: sub_xxxxx
stripeCustomerId: cus_xxxxx
currentPeriodStart: <current date>
currentPeriodEnd: <date 30 days from now>
```

---

## Pricing Strategy

| Plan | Price | Agents | Executions | Models | Best For |
|------|-------|--------|------------|---------|----------|
| Free | $0 | 3 | 100/mo | GPT-3.5 only | Testing |
| **Professional** | **$199** | 10 | 5,000/mo | All models | Small teams |
| **Business** | **$499** | 50 | 25,000/mo | All + routing | Growing companies |
| Enterprise | Custom | Unlimited | Unlimited | Custom models | Large orgs |

---

## Revenue Math

**At 100 customers:**
- 60 Pro ($199) = $11,940/mo
- 30 Business ($499) = $14,970/mo
- 10 Enterprise ($1,500) = $15,000/mo
- **Total: $41,910/mo = $503K ARR**

**At 300 customers:**
- 180 Pro = $35,820/mo
- 90 Business = $44,910/mo
- 30 Enterprise = $45,000/mo
- **Total: $125,730/mo = $1.5M ARR**

---

## Support Resources

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Test Mode Toggle: Top right of dashboard
- API Keys: Developers → API keys
- Webhooks: Developers → Webhooks
- Products: Products (left sidebar)
