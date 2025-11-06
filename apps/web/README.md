# CreAI Web - Landing Page & Dashboard

The main website and user dashboard for CreAI Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## 📁 Project Structure

```
apps/web/
├── app/
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/              # API routes
├── components/            # React components
├── lib/                  # Utilities and helpers
└── public/               # Static assets
```

## 🎨 Features

- **Landing Page**: Conversion-optimized with waitlist signup
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Beautiful dark theme by default
- **Animations**: Smooth transitions and effects
- **SEO Optimized**: Meta tags, OpenGraph, Twitter cards
- **Fast**: Built with Next.js 14 App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Type Safety**: TypeScript

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `NEXT_PUBLIC_APP_URL`: Your domain (https://www.creai.dev)
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for authentication
- `STRIPE_SECRET_KEY`: Stripe API key
- `OPENAI_API_KEY`: OpenAI API key

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t creai-web .

# Run
docker run -p 3000:3000 creai-web
```

## 📊 Analytics & Monitoring

- **PostHog**: Product analytics
- **Sentry**: Error tracking
- **Vercel Analytics**: Web vitals

## 🎯 Next Steps

1. Set up database (see `/packages/db`)
2. Configure Stripe webhooks
3. Add PostHog project
4. Set up Sentry project
5. Deploy to Vercel

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved
