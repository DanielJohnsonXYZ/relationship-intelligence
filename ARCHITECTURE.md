# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                     (Reviews messages,                       │
│                   manages relationships)                     │
└────────────┬────────────────────────────────┬───────────────┘
             │                                 │
             ▼                                 ▼
┌────────────────────────┐         ┌─────────────────────────┐
│   Next.js Frontend     │         │   Next.js API Routes    │
│   (React + Tailwind)   │◄────────┤   /api/people           │
│                        │         │   /api/messages         │
│   - Dashboard          │         │   /api/signals          │
│   - People Management  │         │   /api/inngest          │
│   - Message Review     │         └──────────┬──────────────┘
└────────────────────────┘                    │
                                              │
                          ┌───────────────────┼────────────────┐
                          ▼                   ▼                ▼
                   ┌──────────┐        ┌──────────┐    ┌──────────┐
                   │ Supabase │        │  Claude  │    │ Inngest  │
                   │ Postgres │        │   API    │    │  Cron    │
                   │          │        │          │    │  Jobs    │
                   │ - people │        │ Generate │    │          │
                   │ - signals│        │ Messages │    │ Daily    │
                   │ - messages│       │ Relevance│    │ Run      │
                   └──────────┘        └──────────┘    └────┬─────┘
                                                              │
                                    ┌─────────────────────────┘
                                    ▼
                           ┌──────────────────┐
                           │ Signal Detection │
                           │  (Future APIs)   │
                           │                  │
                           │ - LinkedIn       │
                           │ - Twitter        │
                           │ - News/Press     │
                           │ - RSS Feeds      │
                           └──────────────────┘
```

## Data Flow

### Adding a Person
```
User → Form Input → POST /api/people
              ↓
        Calculate next_contact_date
              ↓
        Insert into Supabase
              ↓
        Return person object
```

### Daily Message Generation (Automated)
```
Inngest Cron (9 AM daily)
        ↓
Query: people where next_contact_date <= today
        ↓
For each person:
    ↓
    Get unused signals (relevance >= 60%)
    ↓
    Get past messages for context
    ↓
    Call Claude API
    ↓
    Save draft message
    ↓
    Calculate new next_contact_date
        ↓
Dashboard shows pending drafts
        ↓
User reviews and sends
```

### Manual Message Generation
```
User clicks "Generate Message Now"
        ↓
POST /api/messages/generate
        ↓
Fetch person + signals + past messages
        ↓
Call Claude API
        ↓
Save draft message
        ↓
Return to dashboard
```

### Signal Detection (Future)
```
Inngest Cron (every 6 hours)
        ↓
Get people with monitoring links
        ↓
For each person:
    ↓
    Call LinkedIn API → new post/job change?
    Call Twitter API → new tweet?
    Call News API → press mention?
    Call RSS parser → blog post?
        ↓
    If signal found:
        ↓
        Calculate relevance with Claude
        ↓
        Insert signal into database
        ↓
        Trigger message generation if high relevance
```

## File Structure

```
relationship-intelligence/
├── app/
│   ├── api/
│   │   ├── people/              # CRUD for people
│   │   │   ├── route.ts         # GET all, POST create
│   │   │   └── [id]/route.ts    # GET, PATCH, DELETE by ID
│   │   ├── messages/            # Message management
│   │   │   ├── route.ts         # GET drafts
│   │   │   ├── [id]/route.ts    # PATCH status
│   │   │   └── generate/route.ts # POST generate message
│   │   ├── signals/
│   │   │   └── route.ts         # POST create signal
│   │   └── inngest/
│   │       └── route.ts         # Inngest webhook endpoint
│   ├── dashboard/
│   │   └── page.tsx             # Review message drafts
│   ├── people/
│   │   ├── page.tsx             # List all people
│   │   ├── new/page.tsx         # Add person form
│   │   └── [id]/page.tsx        # Edit person + signals
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── supabase.ts              # Supabase client
│   ├── claude.ts                # Claude AI functions
│   └── scheduling.ts            # Adaptive scheduling algorithm
├── inngest/
│   ├── client.ts                # Inngest client setup
│   └── functions.ts             # Background jobs
├── supabase/
│   └── schema.sql               # Database schema
├── .env.local.example           # Environment template
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── README.md                    # Main documentation
├── SETUP_GUIDE.md               # Step-by-step setup
└── ARCHITECTURE.md              # This file
```

## Database Schema

### people
```sql
id (uuid)
name (text)
email (text)
company (text)
role (text)
tags (text[])
priority (1-10)
linkedin_url (text)
twitter_handle (text)
company_domain (text)
personal_website (text)
last_contact_date (timestamp)
next_contact_date (timestamp) -- KEY: used for scheduling
responsiveness_score (0-100)   -- Tracks reply rate
relationship_temperature (hot/warm/cold)
notes (text)
communication_style (text)
interests (text[])
created_at (timestamp)
updated_at (timestamp)
```

### signals
```sql
id (uuid)
person_id (uuid → people.id)
signal_type (article|press|job_change|funding|speaking|social_post|other)
title (text)
description (text)
url (text)
source (text) -- "linkedin", "twitter", "manual", etc.
relevance_score (0-100) -- AI-calculated importance
detected_at (timestamp)
processed (boolean)
used_in_message (boolean) -- Prevents reusing same signal
created_at (timestamp)
```

### messages
```sql
id (uuid)
person_id (uuid → people.id)
signal_ids (uuid[]) -- Which signals triggered this message
draft (text) -- AI-generated draft
final_sent (text) -- What actually got sent (if edited)
channel (email|linkedin|twitter|manual)
status (draft|sent|replied|ignored|skipped)
sent_at (timestamp)
replied_at (timestamp)
ai_reasoning (text) -- Why the AI suggested this message
created_at (timestamp)
updated_at (timestamp)
```

## Key Algorithms

### Adaptive Scheduling

Located in `/lib/scheduling.ts`:

```typescript
next_contact_date = today + (base_interval * urgency_multiplier)

urgency_multiplier factors:
- Priority 8-10: × 0.5 (sooner)
- Recent signal (70%+): × 0.3 (much sooner)
- 180+ days since contact: × 0.6 (sooner)
- Cold relationship: × 0.7 (sooner)
- Contacted < 30 days ago: × 2.0 (later)
- High responsiveness (70%+): × 1.2 (later)

base_interval = 90 days (default)
minimum = 7 days (prevent spam)
```

### Responsiveness Score

Uses exponential moving average (EMA):

```typescript
new_score = (current_score × 0.8) + (replied ? 100 : 0) × 0.2

// Gradually increases when they reply
// Gradually decreases when they don't
// Used to determine relationship_temperature
```

### Signal Relevance

Claude evaluates each signal against:
- Person's interests
- Person's role/industry
- Signal significance
- Recency

Returns 0-100 score. Signals < 60% are ignored for message generation.

## API Endpoints

### People
- `GET /api/people` → List all
- `POST /api/people` → Create (auto-calculates next_contact_date)
- `GET /api/people/:id` → Get one with signals
- `PATCH /api/people/:id` → Update
- `DELETE /api/people/:id` → Delete (cascades to signals/messages)

### Messages
- `GET /api/messages` → List drafts
- `POST /api/messages/generate` → Generate draft for person
- `PATCH /api/messages/:id` → Update status/draft
- `POST /api/messages/:id` → Mark replied (updates responsiveness)

### Signals
- `POST /api/signals` → Create signal (auto-calculates relevance)

### Inngest
- `GET|POST|PUT /api/inngest` → Webhook for Inngest workflows

## Deployment Architecture (Production)

```
                     ┌───────────────┐
                     │   Vercel      │
                     │   (Frontend + │
                     │    API)       │
                     └───────┬───────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │ Supabase │ │  Claude  │ │ Inngest  │
         │  Cloud   │ │   API    │ │  Cloud   │
         └──────────┘ └──────────┘ └──────────┘
```

- **Vercel**: Hosts Next.js app (frontend + API routes)
- **Supabase Cloud**: Managed PostgreSQL database
- **Anthropic**: Claude API for AI generation
- **Inngest Cloud**: Runs scheduled background jobs

All services have generous free tiers suitable for personal use.

## Security Considerations

1. **Environment Variables**: Never commit `.env.local`
2. **Service Role Key**: Keep server-side only (not exposed to client)
3. **RLS Policies**: Currently wide open (single user); add auth for multi-user
4. **API Rate Limits**: Consider adding rate limiting for production
5. **Input Validation**: Add Zod or similar for request validation

## Performance Optimizations

1. **Indexes**: Created on frequently queried columns (priority, next_contact_date, status)
2. **Batch Operations**: Inngest processes 10 people per run to avoid timeouts
3. **Caching**: Consider adding Redis for frequently accessed people
4. **Lazy Loading**: Signals only loaded when viewing person detail

## Extending the System

### Adding New Signal Sources

1. Get API key for service
2. Add to `.env.local`
3. Update `/inngest/functions.ts` > `detectSignals`
4. Parse API response into signal format
5. Insert with `POST /api/signals`

### Adding Email Sending

1. Sign up for Resend/SendGrid/Postmark
2. Install SDK: `npm install resend`
3. Create `/lib/email.ts` with send function
4. Update message status flow to trigger send
5. Track delivery status

### Adding Authentication

1. Use Supabase Auth or Clerk
2. Update RLS policies to filter by user_id
3. Add user_id column to people/signals/messages
4. Update API routes to filter by authenticated user

### Adding Analytics

1. Create `/app/analytics/page.tsx`
2. Query Supabase for:
   - Total sent vs replied
   - Average responsiveness by tag
   - Relationship temperature distribution
   - Most effective signal types
3. Visualize with Recharts or Tremor

## Cost Estimates (Personal Use)

- **Supabase**: Free tier (500 MB database, 2 GB bandwidth/month)
- **Vercel**: Free tier (100 GB bandwidth/month)
- **Inngest**: Free tier (up to 1000 function runs/month)
- **Claude API**: ~$0.01-0.03 per message × 30 messages/month = ~$0.30-0.90/month
- **Signal APIs** (optional):
  - Proxycurl: $0.01-0.05 per lookup
  - Twitter API: Free tier available
  - News APIs: Most have free tiers

**Total: < $5/month** for typical personal use (50-100 contacts)

## Monitoring & Debugging

1. **Vercel Logs**: See API request logs and errors
2. **Supabase Logs**: Database query logs and slow queries
3. **Inngest Dashboard**: Function run history and failures
4. **Claude API Console**: Usage and billing tracking
5. **Browser DevTools**: Network requests and console errors

## Future Roadmap Ideas

- [ ] Browser extension for quick signal capture
- [ ] Mobile app (React Native)
- [ ] Calendar integration (suggest meetings)
- [ ] CRM import (LinkedIn, HubSpot)
- [ ] Team collaboration (share relationship networks)
- [ ] Analytics dashboard
- [ ] Email thread analysis (learn from past messages)
- [ ] Relationship health scores
- [ ] Automated A/B testing for message styles
- [ ] Voice of AI (audio messages via ElevenLabs)

---

This architecture is designed to be:
- **Simple**: Easy to understand and modify
- **Scalable**: Can grow from 1 to 10,000+ contacts
- **Cost-effective**: Free tier for personal use
- **Extensible**: Add features without major refactoring
