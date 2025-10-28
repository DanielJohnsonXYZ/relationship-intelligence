# Setup & Launch Checklist

Use this checklist to track your progress getting Relationship Intelligence up and running.

## 🎯 Phase 1: Initial Setup (15 minutes)

### Supabase Setup
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project (name: "relationship-intelligence")
- [ ] Wait for project provisioning (~2 min)
- [ ] Go to SQL Editor
- [ ] Copy contents of `supabase/schema.sql`
- [ ] Paste and click "Run"
- [ ] Verify "Success. No rows returned"
- [ ] Go to Settings > API
- [ ] Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic Setup
- [ ] Create account at [console.anthropic.com](https://console.anthropic.com)
- [ ] Go to API Keys
- [ ] Create new key (name: "relationship-intelligence")
- [ ] Copy key → `ANTHROPIC_API_KEY`
- [ ] Go to Billing
- [ ] Add $5-10 credits

### Inngest Setup (Optional - needed for automation)
- [ ] Create account at [inngest.com](https://inngest.com)
- [ ] Create new app (name: "relationship-intelligence")
- [ ] Go to Keys tab
- [ ] Copy Event Key → `INNGEST_EVENT_KEY`
- [ ] Copy Signing Key → `INNGEST_SIGNING_KEY`

### Environment Configuration
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Paste Supabase URL
- [ ] Paste Supabase anon key
- [ ] Paste Supabase service role key
- [ ] Paste Anthropic API key
- [ ] Paste Inngest keys (if using automation)
- [ ] Save `.env.local`

### Local Development
- [ ] Run `npm install` (if not already done)
- [ ] Run `npm run dev`
- [ ] Visit [http://localhost:3000](http://localhost:3000)
- [ ] See the homepage load successfully
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal

## ✅ Phase 2: Verification (5 minutes)

### Test Basic Functionality
- [ ] Click "Add Your First Person"
- [ ] Fill in test data:
  - Name: "Test Person"
  - Role: "CEO"
  - Company: "Acme Inc"
  - Priority: 8
  - Tags: "founder, test"
  - Notes: "Test entry for verification"
- [ ] Click "Create Person"
- [ ] Redirected to People page
- [ ] See "Test Person" in the list
- [ ] Click "Edit" on Test Person
- [ ] Profile loads successfully

### Test Signal Creation
- [ ] On Test Person's profile, click "Add Signal"
- [ ] Fill in:
  - Type: "Press"
  - Title: "Company raises $10M Series A"
  - Description: "Acme Inc announced Series A funding"
  - URL: "https://example.com/news"
- [ ] Click "Add Signal"
- [ ] Signal appears in list
- [ ] See relevance score (should be 50-100)

### Test Message Generation
- [ ] Click "Generate Message Now" on Test Person
- [ ] Wait for generation (~2-5 seconds)
- [ ] Redirected to Dashboard
- [ ] See draft message
- [ ] Message references the signal
- [ ] See AI reasoning
- [ ] Click "Edit"
- [ ] Modify the message
- [ ] Click "Save & Send"
- [ ] Message disappears from dashboard

### Verify Database Updates
- [ ] Go back to People page
- [ ] Click on Test Person
- [ ] Verify "Last contact" shows today
- [ ] Verify signal is marked as "Used in message"

## 🚀 Phase 3: Real Data (30 minutes)

### Add Your Network
- [ ] Add person #1 from your network
- [ ] Add person #2
- [ ] Add person #3
- [ ] Add person #4
- [ ] Add person #5
- [ ] Add 5 more (total 10 people minimum)

### For Each Important Person:
- [ ] Fill in complete profile (role, company, email)
- [ ] Set appropriate priority (7-10 for VIPs)
- [ ] Add LinkedIn URL if available
- [ ] Add Twitter handle if they're active
- [ ] Add interests (comma-separated)
- [ ] Write detailed notes (helps AI context)

### Add Known Signals
- [ ] Think of recent news about anyone
- [ ] Add manual signals for 3-5 people
- [ ] Include URLs when possible
- [ ] Vary signal types (press, article, speaking, etc.)

## 🎨 Phase 4: Customization (15 minutes)

### Tune AI Voice
- [ ] Open `lib/claude.ts`
- [ ] Find the `generateMessage()` function
- [ ] Locate "MY COMMUNICATION STYLE" section
- [ ] Update with your actual style
- [ ] Save file
- [ ] Generate a test message
- [ ] Review tone and adjust again if needed

### Adjust Scheduling
- [ ] Open `lib/scheduling.ts`
- [ ] Review `DEFAULT_FACTORS`
- [ ] Change `baseInterval` if desired (default: 90 days)
- [ ] Adjust multipliers if needed
- [ ] Save file

### Test Customizations
- [ ] Generate messages for 2-3 people
- [ ] Review tone and timing
- [ ] Iterate on prompts if needed

## 📊 Phase 5: Daily Usage (Ongoing)

### Morning Routine (5 min/day)
- [ ] Open Dashboard
- [ ] Review any pending messages
- [ ] Edit messages as needed
- [ ] Send or skip each one
- [ ] Check People page for anyone due soon

### Throughout the Day
- [ ] When you see someone's news, add a signal
- [ ] After conversations, update notes
- [ ] Adjust priorities as relationships change
- [ ] Mark messages as "replied" when they respond

### Weekly Review
- [ ] Check responsiveness scores
- [ ] Review relationship temperatures
- [ ] Adjust priorities based on current goals
- [ ] Archive or remove stale contacts

## 🌐 Phase 6: Deployment (Optional - 10 minutes)

### Deploy to Vercel
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel` in project directory
- [ ] Follow prompts (link new project)
- [ ] Go to Vercel dashboard
- [ ] Settings > Environment Variables
- [ ] Add all env vars from `.env.local`
- [ ] Redeploy: `vercel --prod`
- [ ] Visit production URL
- [ ] Verify app works

### Connect Inngest
- [ ] In Inngest dashboard, go to your app
- [ ] Go to Sync tab
- [ ] Add sync URL: `https://your-app.vercel.app/api/inngest`
- [ ] Click "Sync Now"
- [ ] Verify functions appear:
  - `generate-daily-outreach`
  - `detect-signals`
- [ ] Test function manually
- [ ] Verify it runs successfully

### Test Production
- [ ] Add a test person via production URL
- [ ] Generate a test message
- [ ] Verify everything works
- [ ] Delete test data

## 🔧 Phase 7: Advanced Setup (Optional)

### Signal Detection APIs
- [ ] Sign up for Proxycurl (LinkedIn)
- [ ] Sign up for X API (Twitter)
- [ ] Sign up for News API
- [ ] Add API keys to env vars
- [ ] Update `inngest/functions.ts` > `detectSignals`
- [ ] Test signal detection
- [ ] Verify signals appear automatically

### Email Sending
- [ ] Sign up for Resend
- [ ] Add API key to env vars
- [ ] Install: `npm install resend`
- [ ] Create `lib/email.ts`
- [ ] Update message flow to send emails
- [ ] Test email sending
- [ ] Verify delivery

### Analytics
- [ ] Create `app/analytics/page.tsx`
- [ ] Query message stats
- [ ] Query response rates
- [ ] Add charts (Recharts)
- [ ] Deploy updates

## 📋 Success Criteria

You're ready to use the system daily when:

✅ **Core Functionality**
- [ ] Can add people via UI
- [ ] Can add signals manually
- [ ] Can generate messages on-demand
- [ ] Messages reference signals appropriately
- [ ] Can edit and send messages
- [ ] Database updates correctly

✅ **Automation** (if deployed)
- [ ] Daily cron runs at 9 AM
- [ ] Messages generate automatically
- [ ] Next contact dates update
- [ ] Can monitor runs in Inngest

✅ **Quality**
- [ ] AI messages sound like you
- [ ] Timing feels appropriate
- [ ] Signals are relevant
- [ ] No technical errors

✅ **Workflow**
- [ ] Comfortable adding people
- [ ] Know how to add signals
- [ ] Daily review takes < 5 minutes
- [ ] Actually sending messages

## 🎯 30-Day Goals

### Week 1
- [ ] 20+ people added
- [ ] 10+ messages generated
- [ ] 5+ messages sent
- [ ] AI voice tuned

### Week 2
- [ ] 50+ people added
- [ ] Daily review routine established
- [ ] First replies received
- [ ] Responsiveness scores updating

### Week 3
- [ ] 100+ people added
- [ ] Automated signal detection live (if implementing)
- [ ] Email sending live (if implementing)
- [ ] System feels natural

### Week 4
- [ ] All contacts migrated
- [ ] Analytics tracking
- [ ] Relationship temperatures accurate
- [ ] Clear ROI (intros, meetings, deals)

## 📈 Metrics to Track

After 30 days, you should see:
- [ ] X messages sent
- [ ] Y% reply rate
- [ ] Z new introductions
- [ ] N meetings scheduled
- [ ] Relationship temperature improving

## 🆘 Troubleshooting Checkpoints

If something's not working:

**Can't build?**
- [ ] Check `npm run build` for TypeScript errors
- [ ] Verify all env vars are set
- [ ] Check Node.js version (18+)

**Can't add people?**
- [ ] Check browser console (F12)
- [ ] Verify Supabase keys are correct
- [ ] Check Supabase dashboard logs

**Messages not generating?**
- [ ] Verify Anthropic API key
- [ ] Check API credits
- [ ] Review browser console errors
- [ ] Check signal relevance scores

**Automation not working?**
- [ ] Verify Inngest keys
- [ ] Check Inngest dashboard for errors
- [ ] Verify sync URL is correct
- [ ] Manually trigger function to test

## 🎉 You're Done When...

- [ ] You check the dashboard every morning
- [ ] You add signals when you see them
- [ ] You've sent 10+ thoughtful messages
- [ ] You've gotten meaningful replies
- [ ] The system feels like a habit

---

**Ready to build relationships at scale with thoughtfulness!**
