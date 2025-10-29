# Alternative APIs for Signal Detection

Beyond the main services (Proxycurl, Perplexity, NewsAPI), here are more options:

## 🎯 LinkedIn Alternatives

### 1. **PhantomBuster** (Easiest LinkedIn Automation)
- **URL**: https://phantombuster.com
- **Price**: $30/month (free trial)
- **What it does**:
  - LinkedIn profile scraper
  - Post scraper
  - Company updates
  - No API - uses automation scripts
- **Pros**: No coding, visual interface
- **Cons**: Slower, may violate LinkedIn ToS
- **Best for**: Non-technical users

### 2. **Bright Data (LinkedIn Dataset)**
- **URL**: https://brightdata.com/products/datasets/linkedin
- **Price**: Pay-per-record ($0.001-0.01 each)
- **What it does**: Pre-scraped LinkedIn data
- **Pros**: Legal, compliant, fresh data
- **Cons**: More expensive at scale
- **Best for**: Large-scale monitoring

### 3. **Piloterr** (LinkedIn API Alternative)
- **URL**: https://piloterr.com
- **Price**: $49/month
- **What it does**: LinkedIn data extraction
- **Pros**: Reliable, good documentation
- **Cons**: Pricier than Proxycurl

---

## 📰 News & Press Alternatives

### 1. **Google News RSS** (FREE!)
- **URL**: Google News custom search
- **Price**: FREE
- **How to use**:
  ```javascript
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(personName)}&hl=en-US&gl=US&ceid=US:en`;
  ```
- **Pros**: Free, no API needed
- **Cons**: Manual parsing, rate limits
- **Best for**: Budget-conscious

### 2. **Bing News API**
- **URL**: https://www.microsoft.com/en-us/bing/apis/bing-news-search-api
- **Price**: Free tier (1000 queries/month), then $3/1000
- **What it does**: News search API
- **Pros**: Cheaper than NewsAPI
- **Cons**: Less comprehensive

### 3. **GNews API**
- **URL**: https://gnews.io
- **Price**: Free (100/day), $10/month (1000/day)
- **What it does**: Global news aggregator
- **Pros**: Generous free tier
- **Cons**: Limited sources

### 4. **Cision** (PR Monitoring)
- **URL**: https://www.cision.com
- **Price**: Enterprise (contact sales)
- **What it does**: Professional PR monitoring
- **Pros**: Comprehensive, includes social
- **Cons**: Expensive, overkill for personal use

---

## 🐦 Twitter/X Alternatives

### 1. **Apify Twitter Scraper**
- **URL**: https://apify.com/vdrmota/twitter-scraper
- **Price**: $49/month (or pay-per-use)
- **What it does**: Scrapes tweets without official API
- **Pros**: No Twitter API approval needed
- **Cons**: Against Twitter ToS technically

### 2. **Nitter** (Self-hosted Twitter Frontend)
- **URL**: https://github.com/zedeus/nitter
- **Price**: FREE (self-host)
- **What it does**: Twitter frontend with RSS feeds
- **Pros**: Free, privacy-focused
- **Cons**: Requires hosting, may break

### 3. **Tweet Binder**
- **URL**: https://www.tweetbinder.com
- **Price**: $49-199/month
- **What it does**: Twitter analytics & monitoring
- **Pros**: Good for hashtag/keyword tracking
- **Cons**: Expensive

---

## 🎤 Speaking & Events

### 1. **Luma API**
- **URL**: https://lu.ma
- **Price**: FREE (public data)
- **What it does**: Event monitoring
- **Implementation**:
  ```javascript
  // Luma has a public API for events
  const eventUrl = `https://api.lu.ma/public/v1/events?query=${personName}`;
  ```
- **Pros**: Popular for tech events
- **Cons**: Limited to Luma events only

### 2. **Eventbrite API**
- **URL**: https://www.eventbrite.com/platform/api
- **Price**: FREE
- **What it does**: Event discovery
- **Pros**: Large event database
- **Cons**: Limited to Eventbrite

### 3. **Meetup API**
- **URL**: https://www.meetup.com/api
- **Price**: FREE
- **What it does**: Meetup event discovery
- **Pros**: Good for local events
- **Cons**: US-centric

---

## 📝 Blogs & Content

### 1. **RSS Feeds** (EASIEST & FREE)
- **Price**: FREE
- **How to use**:
  ```javascript
  import Parser from 'rss-parser';
  const parser = new Parser();

  // Monitor company blog
  const feed = await parser.parseURL('https://company.com/blog/rss');
  ```
- **Pros**: Universal, free
- **Cons**: Manual feed discovery

### 2. **Feedly API**
- **URL**: https://developer.feedly.com
- **Price**: FREE (limited), $18/month (pro)
- **What it does**: RSS aggregation
- **Pros**: Organized, categorized
- **Cons**: Requires curation

### 3. **Medium API**
- **URL**: https://github.com/Medium/medium-api-docs
- **Price**: FREE
- **What it does**: Medium post discovery
- **Pros**: Good for thought leaders
- **Cons**: Medium only

---

## 🚀 Podcasts & Media

### 1. **Listen Notes API**
- **URL**: https://www.listennotes.com/api
- **Price**: Free tier (60 searches/month), $9/month
- **What it does**: Podcast search & monitoring
- **Pros**: Comprehensive podcast database
- **Cons**: Limited free tier

### 2. **Spotify Podcasts API**
- **URL**: https://developer.spotify.com/documentation/web-api/
- **Price**: FREE
- **What it does**: Spotify podcast search
- **Pros**: Large database
- **Cons**: Complex setup

---

## 💼 Company/Funding Data

### 1. **Crunchbase API**
- **URL**: https://data.crunchbase.com/docs
- **Price**: $29/month (basic)
- **What it does**: Funding, acquisitions, company data
- **Pros**: Authoritative startup data
- **Cons**: Expensive for individual use

### 2. **PitchBook** (Enterprise)
- **URL**: https://pitchbook.com
- **Price**: $7,000+/year (enterprise only)
- **What it does**: VC/PE data
- **Pros**: Most comprehensive
- **Cons**: Way too expensive for personal use

### 3. **Free Alternatives**:
- **AngelList** - Manual checking
- **Product Hunt** - Product launches (has API)
- **GitHub** - For technical folks (free API)

---

## 🔧 No-Code Automation Tools

### 1. **Zapier**
- **Price**: $20-50/month
- **What it monitors**:
  - Google Alerts → Your Database
  - RSS Feeds → Your Database
  - Gmail (newsletters) → Your Database
- **Best for**: Non-developers

### 2. **Make.com** (formerly Integromat)
- **Price**: $9-29/month
- **What it does**: Similar to Zapier, more powerful
- **Best for**: Complex workflows

### 3. **n8n** (Self-hosted)
- **Price**: FREE (self-host) or $20/month (cloud)
- **What it does**: Open-source Zapier alternative
- **Best for**: Developers who want control

---

## 💡 Recommended Budget-Friendly Stack

**Total: ~$30-50/month**

1. **Google News RSS** ($0) - News monitoring
2. **RSS Parser** ($0) - Blog monitoring
3. **Apify** ($49/month) - LinkedIn + Twitter scraping
4. **GNews** ($10/month) - Professional news backup

**OR Simpler:**

1. **Perplexity** ($20/month) - Handles news/web
2. **RSS Feeds** ($0) - Blogs
3. **Manual signals** - Just add them when you see stuff!

---

## 🎯 My Recommendation

**Start Simple (Month 1-2):**
- Google News RSS (free)
- Manual signals when you see news
- Total: $0/month

**Add Automation (Month 3):**
- Perplexity ($20/month)
- Total: $20/month

**Go Pro (Month 4+):**
- Proxycurl ($30/month) - LinkedIn
- Perplexity ($20/month) - News
- Total: $50/month

**Don't overcomplicate early - manual signals work great to start!**

---

## Quick Implementation Example

Here's a simple free starter using Google News RSS:

```javascript
// Add to /inngest/functions.ts
import Parser from 'rss-parser';

async function checkGoogleNews(person: Person) {
  if (!person.name) return [];

  const parser = new Parser();
  const query = `${person.name} ${person.company || ''}`;
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US`;

  try {
    const feed = await parser.parseURL(rssUrl);

    return feed.items
      .slice(0, 3) // Top 3 results
      .filter(item => {
        // Only recent (last 30 days)
        const daysSince = (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 30;
      })
      .map(item => ({
        signal_type: 'press' as const,
        title: item.title,
        description: item.contentSnippet || '',
        url: item.link,
        source: 'google-news',
      }));
  } catch (error) {
    console.error(`Google News check failed for ${person.name}`);
    return [];
  }
}
```

**Add to your detectSignals function:**
```javascript
const newsSignals = await checkGoogleNews(person);
```

**That's it! Free news monitoring working.**

---

## Questions?

- Want help implementing a specific API? Ask!
- Not sure which to choose? Start with Google News RSS (free)
- Need enterprise features? Go with Cision or PitchBook

The best signal detection system is the one you'll actually use!
