# Deployment Guide - ChatSphere

This guide covers all deployment options for ChatSphere including GitHub Pages, Vercel, Heroku, GitHub Actions, and collaborators.

---

## 📚 **1. GitHub Pages (Documentation)**

### ✅ Already Configured!

Your documentation is automatically deployed to GitHub Pages when you push to the `main` branch.

**Access your docs:**
```
https://dhanush-murugan.github.io/chatsphere
```

**Enable on GitHub:**

1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/pages
2. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**
4. Wait 1-2 minutes for deployment
5. Visit your site URL above

**What gets deployed:**
- 📄 All `.md` files from `docs/` folder
- 📄 `README.md`
- 🎨 Auto-generated index page

---

## 🚀 **2. Deploy Frontend to Vercel**

### Step 1: Sign Up for Vercel
1. Go to: https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize access to your GitHub account
4. Choose username and email

### Step 2: Import Your Project
1. Go to: https://vercel.com/new
2. Click **Import Project**
3. Paste your repo URL: `https://github.com/Dhanush-murugan/chatsphere`
4. Click **Continue**

### Step 3: Configure Build Settings
```
Framework: Create React App
Root Directory: ./frontend
Build Command: npm run build
Output Directory: build
```

### Step 4: Set Environment Variables
Add these in Vercel dashboard (Settings → Environment Variables):

```
REACT_APP_API_URL = https://your-heroku-app.herokuapp.com
REACT_APP_FIREBASE_API_KEY = [Your Firebase API Key]
REACT_APP_FIREBASE_AUTH_DOMAIN = [Your Firebase Auth Domain]
REACT_APP_FIREBASE_PROJECT_ID = [Your Firebase Project ID]
REACT_APP_FIREBASE_STORAGE_BUCKET = [Your Firebase Storage Bucket]
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = [Your Firebase Messaging Sender ID]
REACT_APP_FIREBASE_APP_ID = [Your Firebase App ID]
```

### Step 5: Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Your app is live at the provided URL!

**Auto-Deploy:**
- Every push to `main` branch → automatic deployment ✅
- Every PR → preview deployment ✅

---

## ⚙️ **3. Deploy Backend to Heroku**

### Step 1: Sign Up for Heroku
1. Go to: https://signup.heroku.com
2. Fill in your details
3. Verify email
4. Set password and create account

### Step 2: Create a New App
1. Go to: https://dashboard.heroku.com/apps
2. Click **New** → **Create New App**
3. App name: `chatsphere-api` (or your preference)
4. Region: Choose closest to you
5. Click **Create App**

### Step 3: Connect GitHub
1. Go to your app's **Deploy** tab
2. Under "Deployment method", click **GitHub**
3. Click **Connect to GitHub**
4. Search for: `chatsphere`
5. Click **Connect**

### Step 4: Configure Environment Variables
1. Go to app's **Settings** tab
2. Click **Reveal Config Vars**
3. Add these variables:

```
DATABASE_URL = postgresql://user:password@host:5432/dbname
JWT_SECRET = your-secret-key-here
NODE_ENV = production
CORS_ORIGIN = https://your-vercel-app.vercel.app
FIREBASE_PROJECT_ID = [Your Firebase Project ID]
FIREBASE_PRIVATE_KEY = [Your Firebase Private Key]
FIREBASE_CLIENT_EMAIL = [Your Firebase Client Email]
```

### Step 5: Enable Auto Deploy
1. In **Deploy** tab, under "Automatic deploys"
2. Select branch: `main`
3. Check ✅ **Wait for CI to pass before deploy**
4. Click **Enable Automatic Deploys**

### Step 6: Deploy
1. Click **Deploy Branch** under "Manual deploy"
2. Watch logs for successful deployment
3. Your API is live at: `https://chatsphere-api.herokuapp.com`

---

## 🤖 **4. GitHub Actions (CI/CD)**

### ✅ Already Configured!

Three workflows are set up:

#### Frontend CI/CD (`frontend-ci.yml`)
- ✅ Runs on: Push to `main` or `develop` branch
- ✅ Tests: Node 16.x and 18.x
- ✅ Actions:
  - Install dependencies
  - Build React app
  - Run linter
  - **Auto-deploy to Vercel**

#### Backend CI/CD (`backend-ci.yml`)
- ✅ Runs on: Push to `main` or `develop` branch
- ✅ Tests: Node 16.x and 18.x with PostgreSQL
- ✅ Actions:
  - Install dependencies
  - Run tests
  - Run linter
  - **Auto-deploy to Heroku**

#### Documentation (`docs.yml`)
- ✅ Runs on: Push to `main` branch
- ✅ Auto-deploys to GitHub Pages

### Enable Secrets for CI/CD

Go to: https://github.com/Dhanush-murugan/chatsphere/settings/secrets/actions

Add these secrets:

**For Frontend (Vercel):**
```
VERCEL_TOKEN = [Get from Vercel Settings]
VERCEL_ORG_ID = [Get from Vercel Settings]
VERCEL_PROJECT_ID = [Get from Vercel Project Settings]
REACT_APP_API_URL = https://chatsphere-api.herokuapp.com
REACT_APP_FIREBASE_API_KEY = [Firebase]
REACT_APP_FIREBASE_AUTH_DOMAIN = [Firebase]
REACT_APP_FIREBASE_PROJECT_ID = [Firebase]
REACT_APP_FIREBASE_STORAGE_BUCKET = [Firebase]
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = [Firebase]
REACT_APP_FIREBASE_APP_ID = [Firebase]
```

**For Backend (Heroku):**
```
HEROKU_API_KEY = [Get from Heroku Account Settings]
HEROKU_EMAIL = [Your Heroku email]
HEROKU_APP_NAME = chatsphere-api
```

### View Workflow Status

1. Go to: https://github.com/Dhanush-murugan/chatsphere/actions
2. Click on a workflow to see details
3. Green ✅ = Success
4. Red ❌ = Failed (check logs)

---

## 👥 **5. Add Collaborators**

### If Working Alone
You're all set! Skip this section.

### If Adding Team Members

1. Go to: https://github.com/Dhanush-murugan/chatsphere/settings/access
2. Click **Invite a collaborator**
3. Enter their GitHub username
4. Choose role:
   - **Maintain**: Can merge PRs
   - **Push**: Can commit directly
   - **Triage**: Can manage issues
   - **Pull**: Read-only access
5. Click **Add** and they'll get an invite

**Best Practice for Teams:**
```
Role Suggestions:
- Project Lead: Maintain (merges PRs)
- Backend Dev: Push (commits to backend/)
- Frontend Dev: Push (commits to frontend/)
- Designer: Triage (manages issues)
- New Contributor: Pull (reviews only)
```

---

## 🔄 **Quick Deployment Checklist**

### Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import project from GitHub
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test at Vercel URL
- [ ] Add `VERCEL_TOKEN` to GitHub Secrets

### Backend (Heroku)
- [ ] Create Heroku account
- [ ] Create app on Heroku
- [ ] Connect GitHub repo
- [ ] Set config variables
- [ ] Enable auto-deploy
- [ ] Deploy manually first
- [ ] Add `HEROKU_API_KEY` to GitHub Secrets

### GitHub Pages
- [ ] Enable Pages in Settings
- [ ] Wait for deployment
- [ ] Visit docs site

### GitHub Actions
- [ ] Add all secrets to GitHub
- [ ] Push changes to trigger workflows
- [ ] Monitor in Actions tab

---

## 🆘 **Troubleshooting**

### Vercel Build Fails
```bash
# Check local build first
cd frontend
npm install
npm run build
```

### Heroku Deployment Fails
```bash
# Check logs
heroku logs --tail -a chatsphere-api

# Check config vars
heroku config -a chatsphere-api
```

### GitHub Actions Fail
- Check secrets are added correctly
- Verify branch name is `main`
- Look at action logs for error messages

### Pages Not Deploying
- Ensure GitHub Pages is enabled
- Check workflow status in Actions tab
- Wait 2-3 minutes after push

---

## 📞 **Support Links**

- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**🎉 Your deployment pipeline is ready!**

Now commit these changes and follow the steps above to complete deployment.

```bash
cd d:\Dhanush\chatsphere
git add .
git commit -m "Add GitHub Actions workflows, Vercel config, and deployment guide"
git push
```

Then open the links above to complete Vercel and Heroku setup! 🚀
