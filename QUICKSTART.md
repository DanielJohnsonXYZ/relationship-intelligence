# Quick Start - Get Running in 5 Commands

## Prerequisites
You need accounts (all have free tiers):
1. [Supabase](https://supabase.com) - Database
2. [Anthropic](https://console.anthropic.com) - AI
3. [Inngest](https://inngest.com) - Automation (optional for testing)

## Step 1: Set Up Services (10 min)

### Supabase
```bash
# 1. Create project at supabase.com
# 2. Go to SQL Editor
# 3. Copy/paste contents of supabase/schema.sql
# 4. Click Run
# 5. Go to Settings > API and copy your keys
```

### Anthropic
```bash
# 1. Sign up at console.anthropic.com
# 2. Go to API Keys
# 3. Create new key
# 4. Add $5-10 credits under Billing
```

### Inngest (Optional - for automation)
```bash
# 1. Sign up at inngest.com
# 2. Create new app
# 3. Go to Keys tab
# 4. Copy Event Key and Signing Key
```

## Step 2: Configure Environment (2 min)

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your keys
# (use nano, vim, or your editor)
nano .env.local
```

Paste your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

ANTHROPIC_API_KEY=sk-ant-...

# Optional - for automation
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=signkey-...
```

## Step 3: Install & Run (1 min)

```bash
# Already done if you just cloned, but in case:
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Add Your First Person (1 min)

1. Click **"Add Your First Person"**
2. Fill in:
   - Name: Someone from your network
   - Role & Company
   - Priority: 7-8
   - Add their LinkedIn URL
   - Add notes about them
3. Click **Create Person**

## Step 5: Generate a Message (30 seconds)

1. Go to the person's profile
2. Click **"Generate Message Now"**
3. Go to **Dashboard**
4. See your AI-drafted message!

## You're Done! 🎉

### What to do next:

**Immediate:**
- Add 10-20 more people from your network
- Generate messages for a few of them
- Tune the AI voice by editing messages
- Send your first messages

**This week:**
- Add manual signals when you see someone's news
- Test the adaptive scheduling (see how next_contact_date changes)
- Customize the message prompt in `/lib/claude.ts`

**Long term:**
- Deploy to Vercel for 24/7 operation
- Connect Inngest for daily automation
- Add signal detection APIs (LinkedIn, Twitter, News)
- Add email sending (Resend, SendGrid)

## Testing the System

### Test Message Generation
```bash
# 1. Add a person
# 2. Add a manual signal (e.g., "Raised Series A")
# 3. Generate message - should reference the signal
```

### Test Adaptive Scheduling
```bash
# 1. Create person with priority 9
# 2. Check next_contact_date (should be soon)
# 3. Create person with priority 3
# 4. Check next_contact_date (should be later)
```

### Test Inngest Locally (Optional)
```bash
# In separate terminal
npx inngest-cli@latest dev

# Opens http://localhost:8288
# You can manually trigger functions there
```

## Common Issues

**"supabaseUrl is required"**
- Check `.env.local` exists (not `.env.local.example`)
- Restart dev server after adding env vars

**"Failed to generate message"**
- Check ANTHROPIC_API_KEY is correct
- Ensure you have credits in Anthropic account
- Check browser console for detailed error

**Database errors**
- Verify schema.sql was run in Supabase
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- View errors in Supabase Dashboard > Logs

**Build errors**
- Run `npm run build` to see TypeScript errors
- Most issues are env vars not being set

## File Locations

- **Database schema**: `supabase/schema.sql`
- **AI prompts**: `lib/claude.ts`
- **Scheduling logic**: `lib/scheduling.ts`
- **Background jobs**: `inngest/functions.ts`
- **Environment vars**: `.env.local` (create from `.env.local.example`)

## Customization Tips

### Change Default Contact Interval
Edit `lib/scheduling.ts`:
```typescript
const DEFAULT_FACTORS = {
  baseInterval: 60, // Change from 90 to 60 days
  // ...
}
```

### Change Message Tone
Edit `lib/claude.ts` > `generateMessage()`:
```typescript
MY COMMUNICATION STYLE:
- [Add your style here]
- [Bullet points work best]
```

### Change Daily Run Time
Edit `inngest/functions.ts`:
```typescript
{ cron: '0 9 * * *' }, // Change 9 to your preferred hour (UTC)
```

## Resources

- **Full Setup**: See SETUP_GUIDE.md
- **Architecture**: See ARCHITECTURE.md
- **Complete Docs**: See README.md
- **Project Overview**: See PROJECT_SUMMARY.md

## Need Help?

1. Check the error message in browser console (F12)
2. Check terminal where dev server is running
3. Check Supabase Dashboard > Logs
4. Check Inngest Dashboard > Functions > Runs

Most issues are:
- Missing env vars
- Database schema not applied
- Invalid API keys

## Success Criteria

You'll know it's working when you can:

✅ Add a person via the form
✅ See them in the People list
✅ Click "Generate Message Now"
✅ See a draft message on the Dashboard
✅ Edit and "send" the message (updates last_contact_date)

**Once these work, you're ready to use the system daily!**

---

**Estimated time: 15 minutes from zero to first message**
