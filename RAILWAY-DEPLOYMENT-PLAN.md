# 🚀 CreAI Railway Deployment Plan - Launch Tonight on www.creai.dev

## Architecture Overview

**CreAI is a single full-stack Next.js 14 application** that includes:
- ✅ **Frontend**: Landing page, dashboard, agent builder UI
- ✅ **Backend API**: 12 API routes handling auth, agents, subscriptions, Stripe
- ✅ **Database**: PostgreSQL with Prisma ORM (7 data models)
- ✅ **AI Integration**: Vercel AI SDK with OpenAI + Anthropic
- ✅ **Payments**: Stripe with 2 subscription tiers

**Deployment Strategy**: One Railway service with PostgreSQL database plugin

---

## 🎯 Pre-Deployment Checklist

### 1. Domain Setup (Do First)
- [ ] Log into your domain registrar (where you bought creai.dev)
- [ ] Prepare to add CNAME record (Railway will provide the value)

### 2. Stripe Products Setup (5 minutes)
Since we couldn't create via API, create these in [Stripe Dashboard](https://dashboard.stripe.com/products):

**Professional Plan**:
- Name: `Professional`
- Price: `$199/month` (recurring)
- Copy the Price ID (starts with `price_`)

**Business Plan**:
- Name: `Business`
- Price: `$499/month` (recurring)
- Copy the Price ID (starts with `price_`)

### 3. OAuth Apps Setup

**Google OAuth** (https://console.cloud.google.com/apis/credentials):
- Create OAuth 2.0 Client
- Authorized redirect URI: `https://creai.dev/api/auth/callback/google`
- Copy Client ID and Secret

**GitHub OAuth** (https://github.com/settings/developers):
- Create New OAuth App
- Authorization callback URL: `https://creai.dev/api/auth/callback/github`
- Copy Client ID and Secret

### 4. NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```

---

## 📋 Railway Deployment Steps

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `ActivateCapital/AutoGPT`
5. Select branch: `claude/lucrative-saas-product-ideas-011CUsTkx3YLvpJt6RrkeDf2`

### Step 2: Configure Root Directory

Railway will auto-detect the monorepo, but ensure:

1. Go to **Service Settings**
2. Under **Source**, set:
   - **Root Directory**: `apps/web`
   - **Watch Paths**:
     ```
     apps/web/**
     packages/db/**
     ```

This ensures Railway only rebuilds when frontend/backend code changes.

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically:
   - Create a PostgreSQL instance
   - Generate `DATABASE_URL` environment variable
   - Link it to your service

### Step 4: Configure Environment Variables

Go to **Service Settings** → **Variables** and add these **17 required variables**:

#### App Configuration
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://creai.dev
```

#### Database (Auto-populated by Railway)
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

#### Authentication
```bash
NEXTAUTH_URL=https://creai.dev
NEXTAUTH_SECRET=<your-generated-secret-from-step-4>
```

#### Google OAuth
```bash
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

#### GitHub OAuth
```bash
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

#### AI Providers
```bash
OPENAI_API_KEY=<your-openai-api-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

#### Stripe
```bash
STRIPE_SECRET_KEY=<your-stripe-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<leave-empty-for-now>
STRIPE_PROFESSIONAL_PRICE_ID=<price-id-from-stripe>
STRIPE_BUSINESS_PRICE_ID=<price-id-from-stripe>
```

**Note**: We'll add `STRIPE_WEBHOOK_SECRET` after deployment when we create the webhook endpoint.

### Step 5: Deploy

1. Click **"Deploy"** in Railway
2. Railway will:
   - Clone your repo
   - Run `npm install` in `apps/web`
   - Run `npm run build`
   - Start the app with `npm start`
3. Monitor the build logs for any errors
4. Build should complete in 2-5 minutes

### Step 6: Custom Domain Setup

1. In Railway service settings, go to **Settings** → **Networking**
2. Click **"Generate Domain"** (this gives you a railway.app URL)
3. Click **"Add Custom Domain"**
4. Enter: `creai.dev` and `www.creai.dev` (if you have Pro plan)
5. Railway will show DNS instructions:
   ```
   Type: CNAME
   Name: @ (for root) or www
   Value: <your-service>.railway.app
   ```
6. Go to your domain registrar and add the CNAME record
7. Wait 5-15 minutes for DNS propagation
8. Railway will auto-generate SSL certificate (Let's Encrypt)
9. Your site will be accessible at https://creai.dev and https://www.creai.dev

**Note**: If you're on Trial plan (1 domain limit), choose either `creai.dev` or `www.creai.dev` and redirect the other.

### Step 7: Database Migrations

Once the app is deployed, run migrations via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run db:generate
railway run npm run db:push
```

Alternatively, you can add a **Dockerfile** that runs migrations automatically, or create a one-off deployment command in Railway settings.

### Step 8: Configure Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://creai.dev/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add to Railway environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
7. Redeploy the service (Railway will auto-redeploy when env vars change)

---

## 🧪 Post-Deployment Testing

### 1. Landing Page
- Visit https://creai.dev
- Verify landing page loads correctly
- Check all sections render properly

### 2. Authentication Flow
- Click "Get Started" or "Sign In"
- Test Google OAuth login
- Test GitHub OAuth login
- Verify you're redirected to dashboard after login

### 3. Agent Creation
- Create a new agent from a template
- Verify agent saves to database
- Check agent appears in dashboard

### 4. Agent Execution
- Execute an agent with a test prompt
- Verify streaming response works
- Check execution history is saved

### 5. Subscription Flow
- Click "Upgrade" to Professional plan
- Complete Stripe checkout
- Verify redirect back to dashboard
- Confirm subscription status updates in UI

### 6. Webhook Testing
- In Stripe Dashboard, go to Webhooks
- Click on your webhook
- Send a test event
- Verify webhook logs show successful delivery

---

## 🔍 Monitoring & Debugging

### View Logs
```bash
railway logs
```

### Check Environment Variables
```bash
railway variables
```

### Restart Service
```bash
railway restart
```

### Common Issues

**Issue**: Build fails with "npm not found"
- ✅ **Fixed**: Already resolved in `nixpacks.toml` with phase dependencies

**Issue**: Database connection errors
- **Fix**: Ensure `DATABASE_URL` is set correctly (should be auto-populated by Railway)
- Run: `railway run prisma db push` to apply schema

**Issue**: NextAuth redirect loops
- **Fix**: Ensure `NEXTAUTH_URL` matches your custom domain exactly
- Update OAuth callback URLs in Google/GitHub to use custom domain

**Issue**: Stripe webhook fails
- **Fix**: Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook URL is exactly `https://creai.dev/api/stripe/webhook`
- Test webhook delivery in Stripe Dashboard

**Issue**: 500 errors on API routes
- **Fix**: Check Railway logs for detailed error messages
- Verify all required environment variables are set
- Ensure Prisma client is generated (run `railway run npm run db:generate`)

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     www.creai.dev (Railway)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js 14 App (apps/web)                  │    │
│  │                                                     │    │
│  │  Frontend:                    Backend API:         │    │
│  │  • Landing page               • /api/auth          │    │
│  │  • Dashboard                  • /api/agents        │    │
│  │  • Agent builder              • /api/executions    │    │
│  │  • Subscription pages         • /api/stripe        │    │
│  │                               • /api/subscription  │    │
│  └──────────────┬──────────────────────┬──────────────┘    │
│                 │                      │                    │
│                 │                      │                    │
│  ┌──────────────▼──────────┐  ┌───────▼────────────┐      │
│  │  PostgreSQL Database    │  │  External APIs     │      │
│  │  (Railway Plugin)       │  │  • OpenAI          │      │
│  │                         │  │  • Anthropic       │      │
│  │  • Users                │  │  • Stripe          │      │
│  │  • Agents               │  │  • Google OAuth    │      │
│  │  • Executions           │  │  • GitHub OAuth    │      │
│  │  • Subscriptions        │  └────────────────────┘      │
│  └─────────────────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria

Your CreAI platform is successfully deployed when:

- ✅ Landing page is accessible at https://creai.dev
- ✅ SSL certificate is active (green padlock in browser)
- ✅ Users can sign up with Google OAuth
- ✅ Users can sign up with GitHub OAuth
- ✅ Users can create agents from templates
- ✅ Agents can execute with streaming responses
- ✅ Subscription upgrades work through Stripe
- ✅ Webhooks update subscription status automatically
- ✅ No errors in Railway deployment logs
- ✅ Database migrations are applied successfully

---

## 🎉 Launch Checklist

Before announcing the launch:

- [ ] Test all critical user flows
- [ ] Verify Stripe test mode is disabled (switch to live keys)
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Set up analytics (optional: PostHog, Google Analytics)
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit for performance
- [ ] Verify SEO meta tags on landing page
- [ ] Test social sharing cards (Open Graph)
- [ ] Prepare launch announcement (Twitter, LinkedIn, Product Hunt)
- [ ] Have support email ready for user questions

---

## 🚀 Ready to Launch!

All the technical groundwork is done. Your deployment plan is:

1. **15 minutes**: Set up Stripe products + OAuth apps
2. **10 minutes**: Configure Railway project + environment variables
3. **5 minutes**: Deploy and wait for build
4. **10 minutes**: Set up custom domain (creai.dev)
5. **5 minutes**: Run database migrations
6. **5 minutes**: Configure Stripe webhook
7. **10 minutes**: Test all critical flows

**Total time**: ~60 minutes from start to live

Good luck with your launch! 🎊
