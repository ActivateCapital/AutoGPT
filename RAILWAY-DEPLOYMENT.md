# CreAI Platform - Railway Deployment Guide

## 🚂 Quick Railway Deployment

Railway has been configured with `railway.toml` and `nixpacks.toml` to properly build the Next.js app from the monorepo structure.

---

## Prerequisites

Before deploying to Railway, make sure you have:

- [ ] Railway account (https://railway.app)
- [ ] All environment variables ready (see below)
- [ ] Stripe products created (Professional & Business plans)
- [ ] OAuth apps set up (Google & GitHub)

---

## Step 1: Create Railway Project

### 1.1 Create New Project
1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your repository: `ActivateCapital/AutoGPT`
4. Branch: `claude/lucrative-saas-product-ideas-011CUsTkx3YLvpJt6RrkeDf2`

### 1.2 Add PostgreSQL Database
1. In your Railway project, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create the database
4. Click on the PostgreSQL service
5. Go to **"Connect"** tab
6. Copy the **"DATABASE_URL"** (we'll use this in environment variables)

---

## Step 2: Configure Environment Variables

### 2.1 Add Variables to Railway Service

Click on your web service → **"Variables"** tab → Add these:

```bash
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app

# Database (Railway provides this automatically, but verify it's set)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Authentication
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Anthropic API (for Claude models)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_... (add after webhook setup)
STRIPE_PROFESSIONAL_PRICE_ID=price_... (from Stripe dashboard)
STRIPE_BUSINESS_PRICE_ID=price_... (from Stripe dashboard)
```

---

## Step 3: Deploy

### 3.1 Trigger Deployment
1. After adding environment variables, Railway will automatically deploy
2. Watch the build logs in the **"Deployments"** tab
3. Build should complete in ~3-5 minutes

### 3.2 Get Your URL
1. Go to **"Settings"** tab of your web service
2. Under **"Domains"**, you'll see your Railway URL
3. Example: `https://creai-production.up.railway.app`
4. Or click **"Generate Domain"** if one isn't created yet

---

## Step 4: Run Database Migrations

After first deployment, set up the database:

### Option A: Railway CLI (Recommended)

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

### Option B: Via Environment Variables

Add these temporary variables to run migrations:

```bash
# In Railway Variables tab, add:
RAILWAY_RUN_BUILD_COMMAND=cd apps/web && npm run db:generate && npm run db:push && npm run build
```

Then redeploy. After successful migration, you can remove this variable.

---

## Step 5: Update OAuth Callback URLs

Now that you have your Railway URL, update OAuth apps:

### Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-app.up.railway.app/api/auth/callback/google
   ```
4. Click **Save**

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click your OAuth App
3. Update **"Authorization callback URL"** to:
   ```
   https://your-app.up.railway.app/api/auth/callback/github
   ```
4. Click **Update application**

---

## Step 6: Set Up Stripe Webhook

### 6.1 Create Webhook Endpoint
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-app.up.railway.app/api/stripe/webhook`
4. Description: `CreAI Railway Production Webhook`

### 6.2 Select Events
Select these events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 6.3 Add Webhook Secret
1. After creating the webhook, click on it
2. Click **"Reveal"** next to "Signing secret"
3. Copy the webhook secret (starts with `whsec_`)
4. In Railway, add variable:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## Step 7: Create Stripe Products

If you haven't created Stripe products yet:

### Professional Plan
1. Go to https://dashboard.stripe.com/test/products
2. Click **"Create product"**
3. Fill in:
   ```
   Name: CreAI Professional Plan
   Description: Full-featured AI automation for professionals
   Pricing: $199/month (recurring)
   ```
4. Click **"Add pricing"** → **"Save product"**
5. Click on the price → Copy the **Price ID** (starts with `price_`)
6. Add to Railway variables:
   ```
   STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxx
   ```

### Business Plan
Repeat for Business plan with $499/month pricing.

---

## Step 8: Test Your Deployment

### 8.1 Basic Tests
- [ ] Visit your Railway URL
- [ ] Landing page loads
- [ ] Click **"Sign In"**
- [ ] Test Google login
- [ ] Test GitHub login
- [ ] Redirects to dashboard after login

### 8.2 Agent Tests
- [ ] Click **"Create Agent"**
- [ ] Select a template
- [ ] Verify model selector shows (Free users see GPT-3.5 only)
- [ ] Create agent successfully
- [ ] Execute agent
- [ ] View results

### 8.3 Subscription Test
- [ ] Click **"Upgrade"** in dashboard
- [ ] Click **"Upgrade to Professional"**
- [ ] Stripe Checkout opens
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify redirect to dashboard
- [ ] Verify plan shows "Professional"
- [ ] Verify all 5 AI models now available in model selector

### 8.4 Webhook Verification
- [ ] Go to Stripe Dashboard → Webhooks
- [ ] Click your webhook endpoint
- [ ] Check **"Events"** tab
- [ ] Verify `checkout.session.completed` event delivered successfully
- [ ] Status should show green checkmark

---

## Railway-Specific Features

### Auto-Deployments
Railway automatically deploys when you push to your connected branch. To disable:
1. Go to **Settings** → **Service**
2. Under **"Deployment"**, toggle **"Auto Deploy"** off

### Environment Variables from Database
Railway automatically makes database credentials available:
```bash
${{Postgres.DATABASE_URL}}
${{Postgres.DATABASE_PRIVATE_URL}}
```

### Custom Domains
To add a custom domain (e.g., app.creai.dev):
1. Go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to your custom domain

### Logs
View real-time logs:
1. Click **"View Logs"** in deployment
2. Or use Railway CLI: `railway logs`

---

## Troubleshooting

### Build Fails with "Cannot find module"
**Solution:** Railway should now use the `railway.toml` and `nixpacks.toml` configs. If it still fails:
1. Check that both config files are in the root directory
2. Verify Railway is using Nixpacks builder (Settings → Builder)

### Database Connection Error
**Solution:**
1. Verify `DATABASE_URL` is set in variables
2. Check PostgreSQL service is running
3. Try using `${{Postgres.DATABASE_PRIVATE_URL}}` instead

### OAuth Login Fails
**Solution:**
1. Verify callback URLs in Google/GitHub match Railway URL exactly
2. Check `NEXTAUTH_URL` variable matches your Railway domain
3. Verify `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)

### Stripe Checkout Doesn't Work
**Solution:**
1. Verify `STRIPE_PROFESSIONAL_PRICE_ID` and `STRIPE_BUSINESS_PRICE_ID` are correct
2. Check that Price IDs are from test mode (start with `price_`)
3. Verify `STRIPE_SECRET_KEY` is set correctly

### Webhook Events Failing
**Solution:**
1. Check webhook URL in Stripe matches your Railway URL exactly
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Test webhook by going to Stripe Dashboard → Webhooks → Your endpoint → Send test webhook

---

## Environment Variables Checklist

Before deployment, verify you have all these set in Railway:

**App (2 variables):**
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL`

**Database (1 variable):**
- [ ] `DATABASE_URL` (auto-set by Railway)

**Auth (5 variables):**
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID`
- [ ] `GITHUB_CLIENT_SECRET`

**AI (2 variables):**
- [ ] `OPENAI_API_KEY`
- [ ] `ANTHROPIC_API_KEY`

**Stripe (5 variables):**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PROFESSIONAL_PRICE_ID`
- [ ] `STRIPE_BUSINESS_PRICE_ID`

**Total: 17 environment variables**

---

## Post-Deployment

### Monitor Your App
- **Logs:** Railway dashboard → Deployments → View Logs
- **Metrics:** Railway shows CPU, Memory, Network usage
- **Database:** Click PostgreSQL service to see connection count, storage

### Scaling
Railway auto-scales based on usage. To configure:
1. Go to **Settings** → **Resources**
2. Adjust memory/CPU limits if needed
3. Free tier: Shared CPU, 512MB RAM
4. Paid tiers: Up to 32GB RAM

### Backup Database
Railway provides automatic backups for paid plans:
1. Click PostgreSQL service
2. Go to **"Backups"** tab
3. View automatic backup schedule

---

## Cost Estimate

**Railway Pricing:**
- **Hobby Plan (Free):** $0/month - 500 hours execution time, shared resources
- **Developer Plan:** $5/month - Includes $5 credit
- **Team Plan:** $20/month per seat - Includes $20 credit

**Typical Usage:**
- Web service: ~$3-5/month (always-on)
- PostgreSQL: ~$2-3/month (512MB)
- Total: **~$5-8/month** for production app

**Once you have users:**
- Upgrade to paid tier for better performance
- Add monitoring and backups
- Consider custom domain

---

## Next Steps

- [ ] Deploy successfully ✓
- [ ] Test all functionality ✓
- [ ] Set up custom domain (optional)
- [ ] Enable Railway Pro for better performance
- [ ] Set up monitoring (Railway provides basic metrics)
- [ ] Create Stripe products in live mode when ready
- [ ] Launch! 🚀

---

## Resources

- **Railway Docs:** https://docs.railway.app
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Railway Discord:** https://discord.gg/railway
- **Status:** https://status.railway.app

---

**Your app is now live on Railway! 🎉**

Railway URL: `https://your-app.up.railway.app`

Test it out and start getting users! 💰
