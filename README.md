# HelvetiLex (SaaS Starter)

## Run locally
1) `cp .env.example .env.local` and fill keys
2) `npm install`
3) `npm run dev`
Open http://localhost:3000

## Deploy on Vercel
Push to GitHub → Import into Vercel → set the same env vars → Deploy.

## ENV you must set
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PRICE_ONEOFF_CHF_999
- STRIPE_PRICE_SUB_BASIC_1199
- STRIPE_PRICE_SUB_STD_1999
- STRIPE_PRICE_SUB_PRO_3999
- NEXT_PUBLIC_SITE_URL
