# 🚀 Getting Started with CreAI Platform

Welcome! You're about to build something amazing. This guide will get you from zero to a live landing page in **under 30 minutes**.

## 🎯 What We've Built So Far

✅ **Complete Project Structure** - Monorepo ready for web, API, and agent engine
✅ **Beautiful Landing Page** - Conversion-optimized with waitlist signup
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
✅ **Dark Theme** - Modern, professional look
✅ **Waitlist API** - Ready to capture early signups
✅ **All Configuration** - TypeScript, Tailwind, PostCSS all set up

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** - VS Code recommended
- **Your domain** - www.creai.dev (already have it!)

## 🏃‍♂️ Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd /home/user/creai-platform/apps/web
npm install
```

This will install all the packages needed for the landing page.

### Step 2: Set Up Environment Variables

```bash
cp .env.example .env.local
```

For now, the landing page will work with just the defaults. You'll add API keys later.

### Step 3: Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

🎉 **You should see your beautiful CreAI landing page!**

## 🎨 What's on the Landing Page

Your landing page includes:

1. **Hero Section**
   - Compelling headline
   - Waitlist signup form
   - Trust indicators
   - Usage stats

2. **Problem Section**
   - 4 key pain points
   - Emotional resonance
   - Clear cost/impact

3. **Solution Section**
   - 3 key differentiators
   - Visual icons
   - Clear benefits

4. **Pricing Section**
   - 3 tiers (Starter, Professional, Business)
   - Feature comparison
   - Clear CTAs

5. **Final CTA**
   - Last chance to join waitlist
   - Social proof

6. **Footer**
   - Navigation links
   - Legal pages

## ✏️ Customizing Your Landing Page

### Change the Copy

Edit `/apps/web/app/page.tsx`:

```typescript
// Example: Change the headline
<h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
  Your New Headline Here
</h1>
```

### Update Colors

The color scheme is defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: "#6366F1",    // Purple
  secondary: "#06B6D4",  // Cyan
  accent: "#10B981",     // Emerald
}
```

### Add Your Logo

1. Add your logo file to `/apps/web/public/`
2. Import and use it in the header

## 📧 Setting Up the Waitlist

### Option 1: Save to File (Quick)

For testing, waitlist signups are logged to the console. Check your terminal to see new signups.

### Option 2: Connect to Database (Recommended)

We'll set up the database in the next step. The waitlist will automatically save to PostgreSQL.

### Option 3: Use a Service

**Quick integration with external services:**

**ConvertKit/Mailchimp:**
```typescript
// In /apps/web/app/api/waitlist/route.ts
await fetch('https://api.convertkit.com/v3/forms/[FORM_ID]/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email,
  }),
});
```

**Airtable:**
```typescript
await fetch('https://api.airtable.com/v0/[BASE_ID]/[TABLE_NAME]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fields: { Email: email, Timestamp: new Date().toISOString() }
  }),
});
```

## 🚀 Deploy to Production

### Deploy to Vercel (Easiest - 5 minutes)

1. **Push to GitHub:**
```bash
cd /home/user/creai-platform
git init
git add .
git commit -m "Initial commit - CreAI landing page"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `apps/web` directory as the root
   - Click "Deploy"

3. **Add Custom Domain:**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add "www.creai.dev"
   - Follow DNS instructions

🎉 **Your site will be live at www.creai.dev in minutes!**

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=.next
```

**AWS/Digital Ocean:**
Use Docker (see below)

**Docker:**
```bash
docker build -t creai-web -f apps/web/Dockerfile .
docker run -p 3000:3000 creai-web
```

## 📊 Add Analytics (Optional but Recommended)

### PostHog (Product Analytics)

1. Sign up at [posthog.com](https://posthog.com)
2. Get your project API key
3. Add to `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
```

4. Add tracking code to `app/layout.tsx`:
```typescript
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com'
  })
}
```

### Google Analytics

1. Get your GA4 Measurement ID
2. Add to `.env.local`:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Add Script tag in `app/layout.tsx`

## 🎯 What to Do This Week

Now that your landing page is live, focus on:

### Day 1-2: Validation ✅
- [ ] Deploy landing page to www.creai.dev
- [ ] Share with 10 potential customers
- [ ] Post on Reddit (r/SaaS, r/Entrepreneur)
- [ ] Post on Twitter/X
- [ ] **Goal: 20 waitlist signups**

### Day 3-4: Content
- [ ] Write 3 blog posts (SEO)
- [ ] Create demo video (Loom)
- [ ] Design social media graphics
- [ ] **Goal: Start content marketing**

### Day 5-7: Product
- [ ] Set up database (we'll do this next)
- [ ] Build first agent template
- [ ] Test end-to-end workflow
- [ ] **Goal: Working prototype**

## 📈 Measuring Success

### Week 1 Goals:
- ✅ Landing page live
- 🎯 100 waitlist signups
- 🎯 10 customer interviews
- 🎯 1 working agent template

Track everything in a spreadsheet:
```
Date | Visitors | Signups | Conversion % | Feedback
```

## 🆘 Troubleshooting

### "Module not found" errors
```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Styles not loading
```bash
# Rebuild Tailwind
npm run build
```

### Can't deploy to Vercel
- Make sure `apps/web` is set as root directory
- Check build logs for errors
- Verify all environment variables are set

## 🎓 Learning Resources

### Next.js
- [Official Docs](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

### React
- [React Docs](https://react.dev)
- [React Patterns](https://reactpatterns.com)

## 📞 Need Help?

If you get stuck:

1. Check the error message carefully
2. Search the issue on Google/Stack Overflow
3. Check Next.js/Tailwind docs
4. Ask in our community (Discord - coming soon!)

## 🎉 You're Off to a Great Start!

You now have:
✅ A professional landing page
✅ Waitlist capture system
✅ Deployment pipeline
✅ Analytics ready

**Next Steps:**
1. Deploy to www.creai.dev
2. Get your first 100 waitlist signups
3. Move to Phase 2: Building the product

Remember: **Done is better than perfect**. Ship the landing page this week and iterate based on feedback!

---

**Questions? Issues?** Open an issue in the repo or check the `/docs` folder for more guides.

**Ready to build the actual product?** See `BUILDING-THE-PRODUCT.md` (coming next!)

Let's build CreAI! 🚀
