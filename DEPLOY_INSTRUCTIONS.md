# Quick Deploy to Web

## Method 1: Vercel CLI (Fastest)

1. Open Terminal in this folder
2. Run: `npx vercel login`
3. Enter your email when prompted
4. Check your email and click the verification link
5. Run: `npx vercel --prod`
6. Answer the prompts (accept defaults)
7. You'll get a URL like: https://relationship-intelligence-xxx.vercel.app

## Method 2: Vercel Dashboard (Visual)

1. Create a GitHub repository:
   - Go to https://github.com/new
   - Name it: relationship-intelligence
   - Click Create (leave everything else default)

2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/relationship-intelligence.git
   git push -u origin main
   ```

3. Deploy on Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click Deploy
   - Wait 2 minutes
   - Get your URL!

## After Deployment

You MUST add your environment variables in Vercel:
1. Go to your project in Vercel dashboard
2. Settings > Environment Variables
3. Add these 4 variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - ANTHROPIC_API_KEY
4. Redeploy (Deployments > ... > Redeploy)

Your app will be live at: https://your-app.vercel.app
