# CreAI Platform - Complete Deployment Checklist

## 🎯 Pre-Deployment Setup

### 1. Stripe Configuration (Required)

#### Create Products in Stripe Dashboard
- [ ] Go to https://dashboard.stripe.com (Test Mode)
- [ ] Navigate to **Products**
- [ ] Create **Professional Plan** product
  - Name: `CreAI Professional Plan`
  - Price: `$199/month` recurring
  - Copy Price ID → Save as `STRIPE_PROFESSIONAL_PRICE_ID`
- [ ] Create **Business Plan** product
  - Name: `CreAI Business Plan`
  - Price: `$499/month` recurring
  - Copy Price ID → Save as `STRIPE_BUSINESS_PRICE_ID`

#### Set Up Webhook
- [ ] Go to **Developers** → **Webhooks**
- [ ] Click **Add endpoint**
- [ ] URL: `https://your-app.onrender.com/api/stripe/webhook` (update after deployment)
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy Signing Secret → Save as `STRIPE_WEBHOOK_SECRET`

### 2. OAuth Applications Setup

#### Google OAuth
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create OAuth 2.0 Client ID
- [ ] Application type: **Web application**
- [ ] Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (development)
  - `https://your-app.onrender.com/api/auth/callback/google` (production)
- [ ] Copy Client ID → Save as `GOOGLE_CLIENT_ID`
- [ ] Copy Client Secret → Save as `GOOGLE_CLIENT_SECRET`

#### GitHub OAuth
- [ ] Go to https://github.com/settings/developers
- [ ] Click **New OAuth App**
- [ ] Application name: `CreAI Platform`
- [ ] Homepage URL: `https://your-app.onrender.com`
- [ ] Authorization callback URL: `https://your-app.onrender.com/api/auth/callback/github`
- [ ] Copy Client ID → Save as `GITHUB_CLIENT_ID`
- [ ] Copy Client Secret → Save as `GITHUB_CLIENT_SECRET`

### 3. AI API Keys

#### OpenAI
- [ ] You already have this! ✓
- [ ] Verify key is active at https://platform.openai.com/api-keys
- [ ] Save as `OPENAI_API_KEY`

#### Anthropic (for Claude models)
- [ ] Go to https://console.anthropic.com
- [ ] Create account or sign in
- [ ] Navigate to **API Keys**
- [ ] Click **Create Key**
- [ ] Name: `CreAI Production`
- [ ] Copy API key → Save as `ANTHROPIC_API_KEY`

### 4. Generate Secrets

#### NextAuth Secret
```bash
# Run this command to generate a random secret:
openssl rand -base64 32
```
- [ ] Copy output → Save as `NEXTAUTH_SECRET`

---

## 🚀 Render Deployment

### 1. Create New Web Service

- [ ] Go to https://dashboard.render.com
- [ ] Click **New** → **Web Service**
- [ ] Connect your GitHub repository: `ActivateCapital/AutoGPT`
- [ ] Branch: `claude/lucrative-saas-product-ideas-011CUsTkx3YLvpJt6RrkeDf2`

### 2. Configure Service

**Basic Settings:**
```
Name: creai-platform (or your choice)
Region: Oregon (US West) or closest to your users
Branch: claude/lucrative-saas-product-ideas-011CUsTkx3YLvpJt6RrkeDf2
Root Directory: apps/web
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**Instance Type:**
- [ ] Start with **Starter** ($7/month) for testing
- [ ] Upgrade to **Standard** ($25/month) when you get users

### 3. Add Environment Variables

Click **Advanced** → **Add Environment Variable** for each:

**App Configuration:**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://creai-platform.onrender.com
```

**Authentication:**
```bash
NEXTAUTH_URL=https://creai-platform.onrender.com
NEXTAUTH_SECRET=<your-generated-secret>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GITHUB_CLIENT_ID=<from-github>
GITHUB_CLIENT_SECRET=<from-github>
```

**AI Models:**
```bash
OPENAI_API_KEY=<your-openai-key>
ANTHROPIC_API_KEY=<your-anthropic-key>
```

**Stripe:**
```bash
STRIPE_SECRET_KEY=<from-stripe-dashboard>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from-stripe-dashboard>
STRIPE_PROFESSIONAL_PRICE_ID=<price-id-from-stripe>
STRIPE_BUSINESS_PRICE_ID=<price-id-from-stripe>
STRIPE_WEBHOOK_SECRET=<from-stripe-webhook>
```

### 4. Add PostgreSQL Database

- [ ] In Render dashboard, click **New** → **PostgreSQL**
- [ ] Name: `creai-database`
- [ ] Database: `creai`
- [ ] User: `creai`
- [ ] Region: Same as web service
- [ ] Plan: **Free** tier to start
- [ ] Click **Create Database**

**Link Database to Web Service:**
- [ ] Go to your web service
- [ ] Click **Environment**
- [ ] Add environment variable:
  ```
  Key: DATABASE_URL
  Value: Select from "Add from Database" dropdown → Choose your PostgreSQL
  ```

### 5. Deploy!

- [ ] Click **Create Web Service**
- [ ] Wait 5-10 minutes for build and deploy
- [ ] Watch the logs for any errors
- [ ] Once deployed, you'll get a URL like `https://creai-platform.onrender.com`

---

## 🗄️ Database Setup

### 1. Run Prisma Migrations

After first deployment, you need to set up the database schema:

**Option A: Via Render Shell**
- [ ] Go to your web service in Render
- [ ] Click **Shell** tab
- [ ] Run these commands:
  ```bash
  cd /opt/render/project/src
  npm install
  npx prisma generate
  npx prisma db push
  ```

**Option B: Via Local (if you have the repo locally)**
- [ ] Set `DATABASE_URL` env var to your Render PostgreSQL URL
- [ ] Run:
  ```bash
  cd apps/web
  npm run db:generate
  npm run db:push
  ```

### 2. Verify Database

- [ ] Go to Render PostgreSQL dashboard
- [ ] Click **Connect** → **External Connection**
- [ ] Use connection details to connect via TablePlus or any SQL client
- [ ] Verify these tables exist:
  - User
  - Account
  - Session
  - VerificationToken
  - Subscription
  - Agent
  - Execution
  - Template
  - Waitlist

---

## ✅ Post-Deployment Testing

### 1. Basic Functionality

- [ ] Visit your Render URL
- [ ] Landing page loads correctly
- [ ] Click **Sign In**
- [ ] Test Google login
- [ ] Test GitHub login
- [ ] Verify redirect to `/dashboard` after login

### 2. Dashboard Features

- [ ] Dashboard displays correctly
- [ ] User name/email shows in header
- [ ] Stats cards display (should show 0s initially)
- [ ] Click **Create Agent** button
- [ ] Verify redirect to `/dashboard/agents/new`

### 3. Agent Creation

- [ ] Select a template (e.g., "Content Writer Agent")
- [ ] Verify form auto-fills with template data
- [ ] Verify model selector shows available models
  - Free users: Should see GPT-3.5 Turbo only
- [ ] Modify agent goal if desired
- [ ] Click **Create Agent**
- [ ] Verify redirect to agent page
- [ ] Verify agent appears in dashboard

### 4. Agent Execution

- [ ] On agent page, click **Execute Agent**
- [ ] Add optional context
- [ ] Click **Execute Agent**
- [ ] Verify execution starts
- [ ] Wait for execution to complete (~30-60 seconds)
- [ ] Refresh page to see status change from "running" to "completed"
- [ ] Click **View Results** icon
- [ ] Verify execution details display:
  - Steps taken
  - Tokens used
  - Cost calculated
  - Final output

### 5. Subscription/Upgrade Flow

- [ ] In dashboard, click **Upgrade** button
- [ ] Verify redirect to `/dashboard/subscription`
- [ ] Verify current plan shows (should be "Free")
- [ ] Click **Upgrade to Professional**
- [ ] Verify Stripe Checkout opens
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify redirect back to dashboard
- [ ] Verify plan now shows "Professional"
- [ ] Verify model selector now shows all 5 models
- [ ] Check Stripe Dashboard:
  - Go to **Payments**
  - Verify successful payment shows
  - Go to **Customers**
  - Verify new customer created
  - Go to **Subscriptions**
  - Verify active subscription

### 6. Webhook Verification

- [ ] In Stripe Dashboard, go to **Developers** → **Webhooks**
- [ ] Click your webhook endpoint
- [ ] Check **Events** tab
- [ ] Verify events delivered successfully:
  - `checkout.session.completed` (green checkmark)
  - `customer.subscription.created` (green checkmark)
- [ ] If any failures, click to see error details

---

## 🔧 Update Webhook URL

**Important:** After deployment, update your Stripe webhook URL

- [ ] Get your actual Render URL: `https://creai-platform.onrender.com`
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Click your webhook
- [ ] Click **...** menu → **Update endpoint**
- [ ] Update URL to: `https://creai-platform.onrender.com/api/stripe/webhook`
- [ ] Click **Update endpoint**
- [ ] Test webhook:
  - Click **Send test webhook**
  - Select `checkout.session.completed`
  - Click **Send test webhook**
  - Verify Status shows "Succeeded"

---

## 🎨 Update OAuth Callback URLs

After deployment, update your OAuth apps with the real URL:

### Google
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Click your OAuth client
- [ ] Under "Authorized redirect URIs", add:
  - `https://creai-platform.onrender.com/api/auth/callback/google`
- [ ] Click **Save**

### GitHub
- [ ] Go to https://github.com/settings/developers
- [ ] Click your OAuth app
- [ ] Update **Authorization callback URL** to:
  - `https://creai-platform.onrender.com/api/auth/callback/github`
- [ ] Click **Update application**

---

## 📊 Monitoring & Analytics

### Set Up Monitoring

**Render Logs:**
- [ ] Bookmark: `https://dashboard.render.com/web/<your-service-id>/logs`
- [ ] Check logs daily for errors

**Stripe Dashboard:**
- [ ] Bookmark: https://dashboard.stripe.com
- [ ] Check daily for new subscriptions

**Database Metrics:**
- [ ] Go to Render PostgreSQL service
- [ ] Check **Metrics** tab
- [ ] Monitor storage usage (free tier = 1GB limit)

### Key Metrics to Track

- [ ] Total users (User table count)
- [ ] Active subscriptions (Subscription table where status = 'active')
- [ ] Total agents created (Agent table count)
- [ ] Total executions (Execution table count)
- [ ] Revenue (MRR = sum of active subscriptions)

---

## 🚨 Troubleshooting

### Build Fails
```
Error: Cannot find module 'ai'
```
**Fix:** The gitignore might be excluding node_modules. Make sure `package.json` is committed.

### Database Connection Error
```
Error: Can't reach database server
```
**Fix:** Verify `DATABASE_URL` environment variable is set correctly. Check Render PostgreSQL is in same region.

### OAuth Login Fails
```
OAuthCallback error
```
**Fix:**
1. Verify callback URLs match exactly in Google/GitHub console
2. Check `NEXTAUTH_URL` matches your Render URL
3. Verify `NEXTAUTH_SECRET` is set

### Stripe Checkout Opens But Doesn't Complete
```
No such price: 'price_...'
```
**Fix:** Verify `STRIPE_PROFESSIONAL_PRICE_ID` and `STRIPE_BUSINESS_PRICE_ID` are correct Price IDs from your Stripe products.

### Webhook Events Failing
```
Webhook signature verification failed
```
**Fix:** Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret from your Stripe webhook endpoint.

---

## 🎉 Launch Checklist

Before announcing your launch:

- [ ] All tests passed ✓
- [ ] Test checkout flow works ✓
- [ ] Webhook events delivering successfully ✓
- [ ] All 5 AI models accessible on Professional plan ✓
- [ ] Database has proper indexes (automatic with Prisma)
- [ ] Error monitoring set up ✓
- [ ] Landing page updated with actual app URL
- [ ] Terms of Service page created (optional for MVP)
- [ ] Privacy Policy page created (optional for MVP)
- [ ] Support email set up (e.g., support@creai.dev)

### Optional Enhancements (Post-MVP):
- [ ] Set up custom domain (e.g., app.creai.dev)
- [ ] Add Google Analytics or PostHog
- [ ] Set up error tracking (Sentry)
- [ ] Create onboarding email sequence
- [ ] Set up status page (status.creai.dev)
- [ ] Create API documentation
- [ ] Add demo video to landing page

---

## 📈 Go Live Strategy

### Week 1: Soft Launch
- [ ] Share with 10-20 friends/colleagues
- [ ] Get feedback on UX
- [ ] Fix critical bugs
- [ ] Monitor Render logs daily

### Week 2-3: Beta Launch
- [ ] Post on Twitter/LinkedIn
- [ ] Share in relevant communities (r/SaaS, r/microsaas, Indie Hackers)
- [ ] Offer early bird discount (e.g., $149/mo instead of $199 for first 100 users)
- [ ] Collect testimonials

### Week 4+: Public Launch
- [ ] Product Hunt launch
- [ ] Press release
- [ ] Content marketing (blog posts about AI automation)
- [ ] SEO optimization
- [ ] Paid ads (if budget allows)

---

## 🎯 Success Metrics

**Week 1 Goals:**
- [ ] 10 signups
- [ ] 2 paid subscriptions
- [ ] 50+ agent executions
- [ ] 0 critical bugs

**Month 1 Goals:**
- [ ] 100 signups
- [ ] 10 paid subscriptions = $2K MRR
- [ ] 500+ agent executions
- [ ] <5% churn rate

**Month 3 Goals:**
- [ ] 500 signups
- [ ] 50 paid subscriptions = $10K MRR
- [ ] 5,000+ agent executions
- [ ] Product-market fit validated

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **AI SDK Docs:** https://sdk.vercel.ai/docs

**Emergency Contacts:**
- Render Status: https://status.render.com
- Stripe Status: https://status.stripe.com
- OpenAI Status: https://status.openai.com
- Anthropic Status: https://status.anthropic.com

---

## ✅ FINAL CHECK

Before you sleep tonight:

- [ ] App is live and accessible
- [ ] You can sign in with Google
- [ ] You can create an agent
- [ ] You can execute an agent
- [ ] You can upgrade to Professional (test mode)
- [ ] Stripe webhook is working
- [ ] No errors in Render logs

**If all checked ✓ → You're live! 🚀**

---

**Congratulations! You now have a production-ready AI automation SaaS platform that can scale to $4M+ ARR.**

**Next stop: First paying customer! 💰**
