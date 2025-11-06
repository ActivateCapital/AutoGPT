# ⚡ QUICK START - Deploy in 30 Minutes

## 🏃‍♂️ Test Locally (5 min)

```bash
cd /home/user/creai-platform/apps/web
npm install
npm run dev
```

Open: **http://localhost:3000**

---

## 🚀 Deploy to Production (15 min)

### Step 1: Push to GitHub (5 min)
```bash
cd /home/user/creai-platform
git init
git add .
git commit -m "Launch CreAI landing page"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/creai-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (5 min)
1. Go to **https://vercel.com**
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Set Root Directory to `apps/web`
5. Click **"Deploy"**

### Step 3: Add Custom Domain (5 min)
1. In Vercel dashboard → Settings → Domains
2. Add `www.creai.dev`
3. Update DNS records (follow Vercel instructions)

**DONE!** Your site is live at www.creai.dev 🎉

---

## 📢 Get First 100 Signups (Week 1)

### Day 1-2: Social Media Blast
- [ ] Post on Reddit → r/SaaS, r/Entrepreneur, r/AutoGPT
- [ ] Post on Twitter/X → Use hashtags #AI #automation #SaaS
- [ ] Post on LinkedIn → Professional network
- [ ] Share in Slack/Discord communities

### Copy-Paste This:
```
🚀 Just launched CreAI - the first no-code platform to build autonomous AI agents

Instead of broken Zapier workflows, get agents that:
✓ Think and plan multi-step tasks
✓ Adapt when things go wrong
✓ Execute autonomously 24/7

Join the waitlist: www.creai.dev

Built with AutoGPT + n8n + 500+ integrations
#AI #automation #nocode #SaaS
```

### Day 3-5: Personal Outreach
- [ ] Email 50 people in your network
- [ ] DM 20 people who might be interested
- [ ] Post in 5 relevant Facebook groups

### Day 6-7: Content
- [ ] Write blog post: "Why I'm Building CreAI"
- [ ] Record demo video (Loom)
- [ ] Create social graphics (Canva)

---

## 💬 Customer Interviews (10 people)

### Questions to Ask:
1. "What manual tasks waste most of your time?"
2. "Have you tried automation tools? What happened?"
3. "Would you pay $199/month for AI agents?"
4. "What features would you need on Day 1?"
5. "When would you want access?"

### Track in Spreadsheet:
| Name | Email | Pain Point | Will Pay? | Notes |
|------|-------|------------|-----------|-------|

---

## 📊 Week 1 Goals

- [ ] ✅ Landing page deployed
- [ ] 🎯 100 waitlist signups
- [ ] 🎯 10 customer interviews
- [ ] 🎯 5 social media posts
- [ ] 🎯 500+ page views

**If you hit these**: Start building the product Week 2!

---

## 🆘 Quick Troubleshooting

**Build fails?**
```bash
cd apps/web
rm -rf node_modules .next
npm install
npm run build
```

**Port 3000 in use?**
```bash
PORT=3001 npm run dev
```

**Vercel deployment fails?**
- Check Root Directory = `apps/web`
- Check build logs for errors
- Verify Node version ≥ 18

---

## 📚 Full Documentation

- `WHAT-WE-BUILT.md` - Complete summary
- `GETTING-STARTED.md` - Detailed guide
- `/docs/*` - Business & technical docs

---

## 🎯 Right Now - Do This:

1. **Open terminal**
2. **Run**: `cd /home/user/creai-platform/apps/web && npm install`
3. **Wait for install to finish**
4. **Run**: `npm run dev`
5. **Open**: http://localhost:3000
6. **Celebrate**: You built a SaaS landing page! 🎉

Then deploy to Vercel and start getting signups!

**LET'S GO!** 🚀
