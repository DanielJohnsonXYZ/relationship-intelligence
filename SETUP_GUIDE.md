# Setup Guide - Get Running in 15 Minutes

This guide will get you from zero to a working Relationship Intelligence system.

## Prerequisites

- Node.js 18+ installed
- A GitHub account (for deployment)
- Credit card for API services (most have generous free tiers)

## Step-by-Step Setup

### Step 1: Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Name it "relationship-intelligence"
4. Choose a database password (save this!)
5. Select a region close to you
6. Wait 2 minutes for provisioning

7. Once ready, go to **SQL Editor** (left sidebar)
8. Click **New Query**
9. Copy the entire contents of `/supabase/schema.sql`
10. Paste and click **Run**
11. You should see "Success. No rows returned"

12. Go to **Settings** > **API** (left sidebar)
13. Copy these three values:
    - `Project URL` → your `NEXT_PUBLIC_SUPABASE_URL`
    - `anon public` key → your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `service_role` key → your `SUPABASE_SERVICE_ROLE_KEY` (click "Reveal" to see it)

### Step 2: Anthropic Setup (2 minutes)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** in the dashboard
4. Click **Create Key**
5. Name it "relationship-intelligence"
6. Copy the key → your `ANTHROPIC_API_KEY`
7. Add $5-10 credits under **Billing** (Claude API costs ~$0.01-0.03 per message)

### Step 3: Inngest Setup (3 minutes)

1. Go to [inngest.com](https://inngest.com) and sign up
2. Click **Create App**
3. Name it "relationship-intelligence"
4. Go to **Keys** tab
5. Copy:
   - `Event Key` → your `INNGEST_EVENT_KEY`
   - `Signing Key` → your `INNGEST_SIGNING_KEY`

### Step 4: Local Environment (2 minutes)

1. In your project folder, create `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and paste your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

ANTHROPIC_API_KEY=sk-ant-...

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=signkey-...
```

3. Save the file

### Step 5: Run Locally (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the homepage!

### Step 6: Test It Out (2 minutes)

1. Click **Add Your First Person**
2. Fill in:
   - Name: "Test Person"
   - Role: "CEO"
   - Company: "Acme Inc"
   - Priority: 8
   - Tags: "founder, investor"
3. Click **Create Person**

4. You'll be redirected to the People page
5. Click **Edit** on your test person
6. Click **Generate Message Now**
7. Go to the **Dashboard**
8. You should see an AI-drafted message!

## Optional: Enable Automatic Daily Messages

### Option A: Run Inngest Dev Server Locally

In a separate terminal:

```bash
npx inngest-cli@latest dev
```

Open [http://localhost:8288](http://localhost:8288) to see the Inngest dashboard.

You can manually trigger the `generate-daily-outreach` function to test it.

### Option B: Deploy to Production (Recommended)

See below for deployment guide.

## Deployment to Production

### Deploy to Vercel (5 minutes)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow prompts:
   - Link to existing project? **No**
   - Project name? **relationship-intelligence**
   - Directory? **.** (current directory)
   - Override settings? **No**

4. After deployment, go to your Vercel dashboard
5. Go to **Settings** > **Environment Variables**
6. Add all your env vars from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `INNGEST_EVENT_KEY`
   - `INNGEST_SIGNING_KEY`

7. Redeploy: `vercel --prod`

### Connect Inngest to Production (2 minutes)

1. In Inngest dashboard, go to your app
2. Go to **Sync** tab
3. Add sync URL: `https://your-app.vercel.app/api/inngest`
4. Click **Sync Now**
5. You should see two functions registered:
   - `generate-daily-outreach` (runs daily at 9 AM)
   - `detect-signals` (runs every 6 hours)

Now your app will automatically generate messages every day!

## What's Next?

### Immediate Next Steps

1. **Add Real People**: Go through your network and add 10-20 people
2. **Add Context**: For each person, add notes, interests, and links
3. **Manually Add Signals**: If you know something newsworthy about someone, add it manually
4. **Review Messages Daily**: Check your dashboard each morning

### Configure Signal Detection (Optional)

To enable automatic signal detection, you'll need API keys for:

- **LinkedIn**: [Proxycurl](https://nubela.co/proxycurl) ($0.01-0.05 per profile lookup)
- **Twitter**: [X API](https://developer.twitter.com) (free tier available)
- **News**: [Perplexity API](https://perplexity.ai) or [Google News API](https://newsapi.org)

Then update `/inngest/functions.ts` > `detectSignals` function with actual API calls.

### Customize the AI Voice

Edit `/lib/claude.ts` > `generateMessage()` prompt to match your communication style.

Test different prompts by generating messages and seeing what feels most "you."

### Set Up Email Sending (Optional)

To actually send emails instead of just drafting:

1. Sign up for [Resend](https://resend.com) (free tier: 100 emails/day)
2. Add `RESEND_API_KEY` to env vars
3. Install: `npm install resend`
4. Update message sending logic to call Resend API

## Troubleshooting

**"Failed to fetch" errors:**
- Make sure dev server is running (`npm run dev`)
- Check browser console for detailed errors
- Verify env vars are set correctly

**"Invalid API key" errors:**
- Double-check you copied keys correctly (no extra spaces)
- Make sure keys are in `.env.local`, not `.env.local.example`
- Restart dev server after changing env vars

**Messages not showing up:**
- Make sure person's `next_contact_date` is in the past
- Try clicking "Generate Message Now" from their profile
- Check Inngest dashboard for function errors

**Database errors:**
- Verify schema was applied in Supabase SQL Editor
- Check for typos in `SUPABASE_SERVICE_ROLE_KEY`

## Support

If you get stuck, check:
1. Browser console (F12) for errors
2. Terminal logs where dev server is running
3. Supabase dashboard > Database > Logs
4. Inngest dashboard > Functions > Runs

## Success Checklist

- [ ] Supabase project created and schema applied
- [ ] All API keys obtained and added to `.env.local`
- [ ] Dev server running at localhost:3000
- [ ] Added test person successfully
- [ ] Generated test message successfully
- [ ] Message appears on dashboard
- [ ] (Optional) Deployed to Vercel
- [ ] (Optional) Inngest connected and synced
- [ ] (Optional) Inngest dev server running locally

If you've checked all these boxes, you're ready to start using Relationship Intelligence!

---

**Time to add your real network and start staying connected!** 🚀
