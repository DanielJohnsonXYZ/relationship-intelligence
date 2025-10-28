# Relationship Intelligence

An AI-powered relationship companion that helps you stay thoughtfully connected to operators and founders you care about.

## Features

- **Smart Signal Detection**: Monitors public updates (LinkedIn, Twitter, news, etc.) and turns them into reasons to reach out
- **AI Message Generation**: Claude crafts personalized messages in your voice, referencing specific details
- **Adaptive Scheduling**: Smart next-contact dates based on signals, priority, relationship health, and responsiveness
- **Review Dashboard**: Edit, approve, or skip each AI-drafted message before sending
- **Relationship Tracking**: Track priority, temperature (hot/warm/cold), and responsiveness for each person

## Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes + Supabase (PostgreSQL)
- **AI**: Claude 3.5 Sonnet via Anthropic API
- **Workflows**: Inngest for background job orchestration
- **Hosting**: Vercel (recommended) + Supabase Cloud + Inngest Cloud

## Quick Start

### 1. Clone and Install

```bash
cd relationship-intelligence
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the schema from `/supabase/schema.sql`
4. Get your keys from Settings > API

### 3. Set Up Anthropic

1. Get API key from [console.anthropic.com](https://console.anthropic.com)
2. Make sure you have credits in your account

### 4. Set Up Inngest (for automation)

1. Create account at [inngest.com](https://inngest.com) (free tier available)
2. Create a new app
3. Get your event and signing keys from the dashboard

### 5. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_key

# Inngest
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Set Up Inngest Dev Server (Optional for local testing)

In a separate terminal:

```bash
npx inngest-cli@latest dev
```

This will run a local Inngest dashboard at [http://localhost:8288](http://localhost:8288)

## Usage

### Adding People

1. Go to **People** page
2. Click **Add Person**
3. Fill in their basic info (name, role, company)
4. Set **priority** (1-10) and **relationship temperature** (hot/warm/cold)
5. Add their **LinkedIn, Twitter, website** for automatic signal detection
6. Add **interests** and **notes** to help AI craft better messages

### Manual Signal Entry

If you see something interesting about someone (article, job change, etc.):

1. Go to their profile
2. Click **Add Signal**
3. Enter the details
4. The AI will calculate relevance automatically

### Reviewing Messages

1. Go to **Dashboard**
2. Review AI-drafted messages
3. **Send as-is**, **Edit**, or **Skip** each one
4. Messages marked "sent" will update the person's last contact date

### Automatic Message Generation

The system runs daily at 9 AM to:
- Find people whose `next_contact_date` has passed
- Generate message drafts based on their signals
- Calculate the next optimal contact date

You can also **Generate Message Now** from any person's profile.

## Adaptive Scheduling Algorithm

The system calculates `next_contact_date` using:

**Factors that bring the date SOONER:**
- High priority (8-10/10)
- Recent high-relevance signal (70%+)
- Haven't contacted in 180+ days
- Cold relationship

**Factors that push the date LATER:**
- Just contacted (< 30 days ago)
- High responsiveness (70%+)
- Warm relationship with recent contact

**Default**: 90 days between contacts, with 7-day minimum to avoid spam.

## Signal Sources (Extend As Needed)

The `/inngest/functions.ts` file has a placeholder `detectSignals` function. You can extend it with:

### LinkedIn (Proxycurl API)
```typescript
const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin`, {
  headers: { 'Authorization': `Bearer ${PROXYCURL_API_KEY}` }
});
```

### Twitter (X API)
```typescript
const tweets = await fetch(`https://api.twitter.com/2/users/${userId}/tweets`, {
  headers: { 'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}` }
});
```

### News/Press (Perplexity API)
```typescript
const news = await fetch('https://api.perplexity.ai/search', {
  method: 'POST',
  body: JSON.stringify({ query: `${person.name} ${person.company}` })
});
```

### RSS Feeds (Company Blogs)
Use a library like `rss-parser` to monitor company blogs.

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard under Settings > Environment Variables.

### Connect Inngest

1. In Inngest dashboard, add your Vercel URL as the app URL
2. Set sync source to `https://your-app.vercel.app/api/inngest`
3. Inngest will automatically trigger your cron jobs

### Database Backups

Supabase automatically backs up your database daily. You can also export manually from the Supabase dashboard.

## Customization

### Changing Message Tone

Edit the prompt in `/lib/claude.ts` > `generateMessage()`:

```typescript
MY COMMUNICATION STYLE:
- Warm but not overly casual
- Reference one specific thing they've done/said
// Add your style here
```

### Adjusting Scheduling

Edit `/lib/scheduling.ts` > `DEFAULT_FACTORS`:

```typescript
const DEFAULT_FACTORS: SchedulingFactors = {
  baseInterval: 90, // Change to 60 for more frequent contact
  priorityWeight: 0.5, // Adjust multipliers
  // ...
};
```

### Adding Custom Signal Types

1. Update the enum in `/lib/types.ts`:
```typescript
export type SignalType = 'article' | 'press' | 'your_new_type' | ...;
```

2. Update the database:
```sql
ALTER TABLE signals DROP CONSTRAINT signals_signal_type_check;
ALTER TABLE signals ADD CONSTRAINT signals_signal_type_check
  CHECK (signal_type IN ('article', 'press', 'your_new_type', ...));
```

## API Routes

- `GET /api/people` - List all people
- `POST /api/people` - Create person
- `GET /api/people/[id]` - Get person with signals
- `PATCH /api/people/[id]` - Update person
- `DELETE /api/people/[id]` - Delete person
- `POST /api/signals` - Create signal (auto-calculates relevance)
- `GET /api/messages` - List draft messages
- `PATCH /api/messages/[id]` - Update message status
- `POST /api/messages/generate` - Generate message for person

## Future Enhancements

- [ ] Email sending integration (Resend/SendGrid)
- [ ] LinkedIn DM integration
- [ ] Twitter DM integration
- [ ] Calendar sync for meeting reminders
- [ ] Analytics dashboard (response rates, relationship health)
- [ ] Multi-user support with auth
- [ ] Mobile app
- [ ] Chrome extension for quick signal capture

## Troubleshooting

**Messages not generating:**
- Check Inngest dashboard for errors
- Verify `ANTHROPIC_API_KEY` is valid
- Ensure people have `next_contact_date` in the past

**Signals not detected:**
- Implement actual API integrations in `/inngest/functions.ts`
- Check API keys for external services

**Database errors:**
- Verify schema was applied correctly in Supabase
- Check service role key has proper permissions

## License

MIT

## Support

For issues or questions, open an issue on GitHub.

---

Built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Claude](https://anthropic.com), and [Inngest](https://inngest.com).
