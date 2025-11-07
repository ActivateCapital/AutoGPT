# ⚡ Render Quick Deploy - 3 Simple Steps

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (5 min)
```bash
cd /home/user/creai-platform
git init
git add .
git commit -m "Deploy CreAI to Render"
git remote add origin https://github.com/YOUR_USERNAME/creai-platform.git
git push -u origin main
```

### Step 2: Deploy on Render (5 min)
1. Go to **https://dashboard.render.com**
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub → Select **creai-platform** repo
4. Click **"Apply"**

Render will automatically:
- Read `render.yaml`
- Create web service
- Build & deploy

### Step 3: Set Environment Variables (5 min)
In Render dashboard → Your service → **Environment** tab:

**Add these 2 variables:**
```
NEXT_PUBLIC_APP_URL=https://creai.onrender.com
NODE_ENV=production
```

Click **"Save Changes"**

---

## ✅ Done!

Your site will be live at: **https://creai.onrender.com**

Test it → Share it → Get signups! 🎉

---

## 🌐 Add Custom Domain (Optional)

**After deployment:**

1. Your service → **Settings** → **Custom Domains**
2. Add: `www.creai.dev`
3. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: creai.onrender.com
   ```
4. Wait 10-15 min for DNS propagation

**Then live at:** www.creai.dev with HTTPS! 🔒

---

## 🆘 Issues?

**Build fails?**
- Check build logs in Render dashboard
- Make sure you set Root Directory to `apps/web`
- Verify package.json is in `apps/web/`

**Site not loading?**
- Wait for build to complete (2-3 min)
- Check environment variables are set
- Try incognito mode

**DNS not working?**
- Wait 15 min for propagation
- Check DNS records at dnschecker.org
- Clear browser cache

---

## 📚 Full Documentation

For detailed guide, see: **DEPLOY-TO-RENDER.md**

For environment variables, see: **RENDER-ENV-VARIABLES.md**

---

**That's it! Now go deploy!** 🚀
