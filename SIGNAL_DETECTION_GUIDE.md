# Automated Signal Detection Setup Guide

This guide shows you how to set up automated signal detection from LinkedIn, Twitter, News, and other sources.

## Overview

The system monitors your contacts for:
- 📱 **LinkedIn**: Job changes, posts, articles, company updates
- 🐦 **Twitter/X**: Tweets, mentions, threads
- 📰 **News**: Press mentions, funding announcements, awards
- 🎤 **Speaking**: Conference talks, podcast appearances
- 📝 **Blogs**: Company blog posts, personal articles

---

## Quick Start (Recommended Services)

### 1. Proxycurl (LinkedIn Data) - RECOMMENDED
**Best for**: LinkedIn profiles, job changes, company updates

**Setup:**
1. Sign up at: https://nubela.co/proxycurl
2. Pricing: $0.01-0.05 per lookup (~$10-50/month for 100 contacts)
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   PROXYCURL_API_KEY=your_key_here
   ```

**What you can monitor:**
- Profile changes (job title, company)
- Recent posts
- Articles they've written
- Company updates

---

### 2. Perplexity AI (News & Web Search) - EASIEST
**Best for**: News mentions, press, general web monitoring

**Setup:**
1. Sign up at: https://www.perplexity.ai/pro
2. Pricing: $20/month unlimited searches
3. Get API key
4. Add to `.env.local`:
   ```
   PERPLEXITY_API_KEY=your_key_here
   ```

**What you can monitor:**
- News articles mentioning them
- Press releases
- Funding announcements
- Awards and recognition

---

### 3. NewsAPI (Alternative to Perplexity)
**Best for**: Dedicated news monitoring

**Setup:**
1. Sign up at: https://newsapi.org
2. Free tier: 100 requests/day
3. Get API key
4. Add to `.env.local`:
   ```
   NEWS_API_KEY=your_key_here
   ```

---

### 4. Twitter/X API (Optional)
**Best for**: Twitter activity monitoring

**Setup:**
1. Sign up at: https://developer.twitter.com
2. Apply for API access
3. Free tier available (limited)
4. Add to `.env.local`:
   ```
   TWITTER_BEARER_TOKEN=your_token_here
   ```

---

## Implementation Code

Once you have API keys, update `/inngest/functions.ts`:

### Proxycurl LinkedIn Detection

```typescript
// Add to detectSignals function in inngest/functions.ts

async function checkLinkedInUpdates(person: Person) {
  const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY;
  if (!PROXYCURL_API_KEY || !person.linkedin_url) return [];

  try {
    // Get profile data
    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(person.linkedin_url)}`,
      {
        headers: {
          'Authorization': `Bearer ${PROXYCURL_API_KEY}`
        }
      }
    );

    const data = await response.json();
    const signals = [];

    // Check for job change
    if (data.experiences && data.experiences[0]) {
      const currentJob = data.experiences[0];
      const jobTitle = `${currentJob.title} at ${currentJob.company}`;

      // Compare with stored role/company
      if (currentJob.title !== person.role || currentJob.company !== person.company) {
        signals.push({
          signal_type: 'job_change',
          title: `New role: ${jobTitle}`,
          description: `Started as ${currentJob.title} at ${currentJob.company}`,
          url: person.linkedin_url,
          source: 'linkedin',
        });
      }
    }

    // Check for recent posts
    if (data.activities && data.activities.length > 0) {
      const recentPost = data.activities[0];
      const postDate = new Date(recentPost.created_at);
      const daysSince = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince < 7) {
        signals.push({
          signal_type: 'social_post',
          title: `Posted on LinkedIn`,
          description: recentPost.text?.substring(0, 200),
          url: recentPost.link,
          source: 'linkedin',
        });
      }
    }

    return signals;
  } catch (error) {
    console.error(`LinkedIn check failed for ${person.name}:`, error);
    return [];
  }
}
```

### Perplexity News Detection

```typescript
async function checkNewsM entions(person: Person) {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) return [];

  try {
    const query = `${person.name} ${person.company || ''} news last 30 days`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'user',
          content: `Find recent news about ${person.name}${person.company ? ` at ${person.company}` : ''}. Return as JSON: {found: boolean, articles: [{title, summary, url, date}]}`
        }],
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    if (result.found && result.articles.length > 0) {
      return result.articles.map((article: any) => ({
        signal_type: 'press',
        title: article.title,
        description: article.summary,
        url: article.url,
        source: 'news',
      }));
    }

    return [];
  } catch (error) {
    console.error(`News check failed for ${person.name}:`, error);
    return [];
  }
}
```

### Update the Main detectSignals Function

```typescript
export const detectSignals = inngest.createFunction(
  { id: 'detect-signals', name: 'Detect Signals from External Sources' },
  { cron: '0 */6 * * *' }, // Every 6 hours
  async ({ step }) => {
    const supabase = getServiceSupabase();

    const people = await step.run('get-people-to-monitor', async () => {
      const { data } = await supabase
        .from('people')
        .select('*')
        .or('linkedin_url.neq.null,twitter_handle.neq.null,company_domain.neq.null')
        .order('priority', { ascending: false })
        .limit(20); // Monitor top 20 each run

      return data as Person[];
    });

    if (!people || people.length === 0) {
      return { message: 'No people to monitor' };
    }

    let totalSignals = 0;

    for (const person of people) {
      const signals = await step.run(`detect-signals-${person.id}`, async () => {
        const allSignals = [];

        // Check LinkedIn
        if (person.linkedin_url) {
          const linkedInSignals = await checkLinkedInUpdates(person);
          allSignals.push(...linkedInSignals);
        }

        // Check News
        const newsSignals = await checkNewsMentions(person);
        allSignals.push(...newsSignals);

        // Save signals to database
        for (const signal of allSignals) {
          await supabase.from('signals').insert({
            person_id: person.id,
            ...signal,
          });
        }

        return allSignals.length;
      });

      totalSignals += signals;

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return {
      peopleMonitored: people.length,
      signalsFound: totalSignals,
    };
  }
);
```

---

## Cost Estimates

| Service | Free Tier | Paid Tier | Est. Cost (100 contacts) |
|---------|-----------|-----------|--------------------------|
| Proxycurl | None | $0.01-0.05/lookup | $10-50/month |
| Perplexity | None | $20/month unlimited | $20/month |
| NewsAPI | 100 req/day | $449/month | Free (if <100 req/day) |
| Twitter API | Limited | Varies | Free-$100/month |

**Recommended Budget**: $30-70/month for full automation

---

## Testing Your Setup

1. Add API keys to `.env.local`
2. Redeploy to Vercel
3. In Inngest dashboard, manually trigger `detect-signals`
4. Check your database for new signals
5. Generate a message to see if signals are used

---

## Simpler Alternative: RSS Feeds

For company blogs and news without APIs:

```typescript
import Parser from 'rss-parser';

async function checkRSSFeed(feedUrl: string, person: Person) {
  const parser = new Parser();
  const feed = await parser.parseURL(feedUrl);

  const recentItems = feed.items
    .filter(item => {
      const daysSince = (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 30;
    })
    .map(item => ({
      signal_type: 'article' as const,
      title: item.title,
      description: item.contentSnippet,
      url: item.link,
      source: 'rss',
    }));

  return recentItems;
}
```

---

## No-Code Alternative: Zapier/Make

If you don't want to code:

1. Use **Zapier** or **Make.com**
2. Set up monitors for:
   - Google Alerts (for news mentions)
   - RSS feeds (for blogs)
   - LinkedIn (via integrations)
3. Send results to your API endpoint:
   ```
   POST https://your-app.vercel.app/api/signals
   ```

---

## Recommended Workflow

**Week 1-2**: Manual signals only (learn the system)
**Week 3-4**: Add Perplexity for news monitoring
**Month 2**: Add Proxycurl for LinkedIn (once you see value)
**Month 3**: Add Twitter if your contacts are active there

---

## Next Steps

1. Choose 1-2 signal sources to start
2. Get API keys
3. Add to `.env.local`
4. Update `/inngest/functions.ts` with the code above
5. Deploy and test
6. Monitor signal quality
7. Adjust relevance thresholds as needed

**Questions?** Check the main README or the Inngest dashboard for logs.
