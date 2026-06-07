# ⚡ Quick Deployment Setup Instructions

## 🚀 STEP 1: Complete Vercel Setup (Frontend)

**You're already on this page:** https://vercel.com/new/import

### Configure Your Frontend:

1. **Application Preset**: Click dropdown → Select **"Create React App"**
2. **Root Directory**: Click **Edit** → Change from `./` to **`./frontend`** → Save
3. **Build and Output Settings** (expand):
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variables** (expand):
   Add these variables (you'll need your Firebase credentials):
   ```
   REACT_APP_API_URL = https://chatsphere-api.herokuapp.com
   REACT_APP_FIREBASE_API_KEY = your-value-here
   REACT_APP_FIREBASE_AUTH_DOMAIN = your-value-here
   REACT_APP_FIREBASE_PROJECT_ID = your-value-here
   REACT_APP_FIREBASE_STORAGE_BUCKET = your-value-here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your-value-here
   REACT_APP_FIREBASE_APP_ID = your-value-here
   ```

5. **Click "Deploy"** button → Wait for build to complete (takes 2-3 minutes)

6. **Note your Vercel URL** when deployment succeeds ✅

---

## 📋 STEP 2: Set Up GitHub Secrets (for Auto-Deployments)

Your workflows need tokens to deploy automatically.

### Get Vercel Token:
1. Go to: https://vercel.com/account/tokens
2. Click **Create Token**
3. Name: `VERCEL_TOKEN`
4. Expiration: 90 days
5. Copy the token

### Get Vercel Project ID:
1. Go to: https://vercel.com/Dhanush-murugan/chatsphere/settings/general
2. Find **"Project ID"** → Copy it

### Get Vercel Organization ID:
1. Go to: https://vercel.com/account/settings
2. Find **"User ID"** → Copy it (this is your ORG ID for personal accounts)

### Add Secrets to GitHub:
1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/secrets/actions
2. Click **New repository secret** for each:

```
VERCEL_TOKEN = (paste token from step 1)
VERCEL_PROJECT_ID = (paste from step 2)
VERCEL_ORG_ID = (paste from step 3)
REACT_APP_API_URL = https://chatsphere-api.herokuapp.com
REACT_APP_FIREBASE_API_KEY = (Firebase config)
REACT_APP_FIREBASE_AUTH_DOMAIN = (Firebase config)
REACT_APP_FIREBASE_PROJECT_ID = (Firebase config)
REACT_APP_FIREBASE_STORAGE_BUCKET = (Firebase config)
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = (Firebase config)
REACT_APP_FIREBASE_APP_ID = (Firebase config)
```

---

## ⚙️ STEP 3: Set Up Heroku (Backend)

### Create Heroku Account & App:
1. Go to: https://signup.heroku.com
2. Sign up with your email
3. Go to: https://dashboard.heroku.com/apps
4. Click **New** → **Create new app**
5. App name: `chatsphere-api`
6. Region: Choose your region
7. Click **Create app**

### Connect GitHub:
1. In your new Heroku app, go to **Deploy** tab
2. Click **GitHub** under "Deployment method"
3. Click **Connect to GitHub**
4. Search for `chatsphere` → Click **Connect**

### Add Configuration:
1. Go to **Settings** tab
2. Click **Reveal Config Vars**
3. Add these variables:
```
DATABASE_URL = postgresql://user:password@host:5432/chatsphere
JWT_SECRET = your-secret-key-here
NODE_ENV = production
CORS_ORIGIN = https://chatsphere.vercel.app
FIREBASE_PROJECT_ID = (your Firebase project ID)
FIREBASE_PRIVATE_KEY = (your Firebase private key JSON)
FIREBASE_CLIENT_EMAIL = (your Firebase client email)
```

### Deploy:
1. In **Deploy** tab, scroll to **Manual deploy**
2. Select branch: `main`
3. Click **Deploy Branch**
4. Wait for deployment (5-10 minutes)
5. Get your Heroku URL: `https://chatsphere-api.herokuapp.com`

---

## 🔐 STEP 4: Add GitHub Secrets for Backend

### Get Heroku API Key:
1. Go to: https://dashboard.heroku.com/account
2. Scroll to **API Key**
3. Click **Reveal** → Copy it

### Add to GitHub:
1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/secrets/actions
2. Add these secrets:

```
HEROKU_API_KEY = (paste Heroku API key)
HEROKU_EMAIL = (your email)
HEROKU_APP_NAME = chatsphere-api
```

---

## ✅ STEP 5: Enable GitHub Pages

Already configured! Just enable it:

1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/pages
2. Source: Select **Deploy from a branch**
3. Branch: `main` | Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes
6. Visit: https://dhanush-murugan.github.io/chatsphere

---

## 👥 STEP 6: Add Collaborators (if needed)

To add team members:

1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/access
2. Click **Invite a collaborator**
3. Enter GitHub username
4. Choose role:
   - **Maintain**: Full access, can merge PRs
   - **Push**: Can commit directly
   - **Triage**: Can manage issues
   - **Pull**: Read-only
5. Send invite

---

## 🎯 Deployment Checklist

- [ ] Deploy frontend to Vercel
- [ ] Vercel auto-deployment works (check with git push)
- [ ] Backend deployed to Heroku
- [ ] Heroku auto-deployment works
- [ ] GitHub Pages enabled and docs visible
- [ ] GitHub Actions secrets added
- [ ] Workflows triggering on push
- [ ] Collaborators invited (if applicable)

---

## 📊 Status After Setup

When complete, you'll have:
- ✅ Frontend at: `https://chatsphere.vercel.app`
- ✅ Backend at: `https://chatsphere-api.herokuapp.com`
- ✅ Docs at: `https://dhanush-murugan.github.io/chatsphere`
- ✅ CI/CD pipelines running automatically
- ✅ Auto-deploy on every push to `main`

---

## 🆘 Need Help?

- **Vercel Issues**: https://vercel.com/docs
- **Heroku Issues**: https://devcenter.heroku.com
- **GitHub Actions Issues**: Check the Actions tab for error logs

**Next: Follow the steps above in order to complete full deployment!** 🚀
