# 🔥 EMERGENCY: DEPLOY AI-SERVICES & BACKEND TO YOUR RENDER ACCOUNT

## Current Problem
- Backend deployed to: Friend's Render account ❌
- AI-Services deployed to: Friend's Render account ❌
- Your code with fixes: On GitHub, not deployed ❌
- **Result: Fixes never reach production!**

## Solution
Deploy BOTH services to YOUR Render account, then update environment variables.

---

## STEP 1: Deploy AI-Services to Your Render Account

### 1a. Go to Render Dashboard
```
https://dashboard.render.com
```
Log in with YOUR account (not friend's!)

### 1b. Click "New +" → "Web Service"

### 1c. Connect Your GitHub Repo
- Click "Connect account" (connect to YOUR GitHub)
- Select: `Civic-AI-System` (YOUR repo)
- Click "Connect"

### 1d. Configure Service
```
Name:              civic-ai-services
Environment:       Python 3.11
Region:            Your choice (closer is faster)
Branch:            main
Build Command:     pip install -r requirements.txt
Start Command:     gunicorn -w 1 -b 0.0.0.0:$PORT app:app
Plan:              Free
Auto-deploy:       Yes (so it auto-updates when you push)
```

### 1e. Add Environment Variables
Click "Environment" and add:

```
HF_TOKEN = [your HuggingFace token]
CLOUDINARY_CLOUD_NAME = [your value]
CLOUDINARY_API_KEY = [your value]
CLOUDINARY_API_SECRET = [your value]
GEMINI_API_KEY = [your value]
GOOGLE_API_KEY = [your value]
```

(Copy from your friend's deployment if you don't have these)

### 1f. Click "Create Web Service"
⏳ Wait ~5-10 minutes for deployment

---

## STEP 2: Deploy Backend to Your Render Account

### 2a. Same process as above

### 2b. Click "New +" → "Web Service"

### 2c. Configure Service
```
Name:              civic-ai-backend
Environment:       Node
Region:            Same as AI-services
Branch:            main
Build Command:     npm install
Start Command:     npm start
Plan:              Free
Auto-deploy:       Yes
```

### 2d. Add Environment Variables
Click "Environment" and add ALL these:

```
MONGO_URI = [copy from friend's backend]
JWT_SECRET = [generate random string or copy from friend]
CLOUDINARY_CLOUD_NAME = [your value]
CLOUDINARY_API_KEY = [your value]
CLOUDINARY_API_SECRET = [your value]
AI_SERVICE_URL = [YOUR NEW AI-SERVICES URL - see step 3]
SMTP_HOST = [from friend]
SMTP_PORT = [from friend]
SMTP_USER = [from friend]
SMTP_PASS = [from friend]
EMAIL_FROM = [from friend]
OTP_LENGTH = [from friend - usually 6]
OTP_EXPIRE_MINUTES = [from friend - usually 10]
OTP_MAX_ATTEMPTS = [from friend - usually 5]
```

### 2e. Click "Create Web Service"
⏳ Wait ~5-10 minutes for deployment

---

## STEP 3: Get Your New URLs

Once both are deployed and showing "Live":

**Find civic-ai-services URL:**
1. Go to civic-ai-services dashboard
2. Top of page shows URL like: `https://civic-ai-services-xxx.onrender.com`
3. **COPY THIS URL**

**Find civic-ai-backend URL:**
1. Go to civic-ai-backend dashboard
2. Top of page shows URL like: `https://civic-ai-backend-xxx.onrender.com`
3. **COPY THIS URL**

---

## STEP 4: Update Backend's AI_SERVICE_URL

Go back to civic-ai-backend:
1. Click "Settings"
2. Look for "Environment"
3. Find `AI_SERVICE_URL`
4. Update it to your NEW ai-services URL
5. Click "Save"
6. Deployment will redeploy automatically

---

## STEP 5: Update Frontend Environment Variables

Update these in your Vercel frontends (citizen-web, crew-web, admin-web):

**For each frontend in Vercel:**
1. Go to https://vercel.com/dashboard
2. Click the project (citizen-web, crew-web, or admin-web)
3. Go to Settings → Environment Variables
4. Update `VITE_API_BASE_URL` to:
   ```
   https://YOUR-NEW-BACKEND-URL/api
   ```
   (Replace with your actual backend URL)

5. Redeploy by going to Deployments → Deploy (or push to git)

---

## QUICK CHECKLIST

**Render (Your Account):**
- [ ] civic-ai-services deployed (shows "Live" with new URL)
- [ ] civic-ai-backend deployed (shows "Live" with new URL)
- [ ] Backend's AI_SERVICE_URL points to YOUR ai-services
- [ ] All env variables filled in correctly

**Vercel (Frontends):**
- [ ] citizen-web `VITE_API_BASE_URL` → YOUR backend URL
- [ ] crew-web `VITE_API_BASE_URL` → YOUR backend URL  
- [ ] admin-web `VITE_API_BASE_URL` → YOUR backend URL
- [ ] All frontends redeployed

---

## QUICK REFERENCE: COPY FROM FRIEND'S SETUP

You need to get these values from friend's Render account:
1. `CLOUDINARY_CLOUD_NAME` 
2. `CLOUDINARY_API_KEY`
3. `CLOUDINARY_API_SECRET`
4. `GEMINI_API_KEY`
5. `GOOGLE_API_KEY`
6. `MONGO_URI`
7. `JWT_SECRET`
8. `SMTP_HOST`
9. `SMTP_PORT`
10. `SMTP_USER`
11. `SMTP_PASS`
12. `EMAIL_FROM`
13. OTP settings

Ask friend to share these values or take screenshots of the environment variables.

---

## EXPECTED TIMELINE

- Deploy AI-services: 5-10 mins
- Deploy Backend: 5-10 mins  
- Update env vars: 2 mins
- Vercel redeploy: 2-5 mins
- **TOTAL: 15-30 minutes to full fix**

---

## AFTER EVERYTHING IS DEPLOYED

Test the flow:
1. Upload image to citizen-web
2. Should see result in 2-5 seconds (using new AI service)
3. Form should submit
4. Check Render logs for "CRITICAL DEADLINE FIX" message

---

## HELP! MY FRIEND'S ENV VARIABLES

Ask your friend to show you their Render env variables by:
1. They go to their Render dashboard
2. Click civic-ai-services or civic-ai-backend
3. Take screenshot of Environment section
4. Share with you (or just tell you the values)

You need those to set up YOUR instances.
