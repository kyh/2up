[![GitHub last commit](https://img.shields.io/github/last-commit/kyh/coinop)](https://github.com/kyh/coinop)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-%237289DA)](https://discord.gg/YtafKzR)

# CoinOp

[🚀 Website]() | [App Store]() | [Play Store]()

> A platform for real-time multiplayer trivia games 🎮

## Get Started

```
│── /docs                        # App documentation
├── /web                         # Web ReactJS client
|   └── /src
│       ├── /components          # Shared React components
│       ├── /lib                 # App features
│       ├── /pages               # Next.js renderable pages
│       ├── /server              # TRPC api backend
│       ├── /styles              # Theme and global styling
│       └── /utils               # Utility modules
└── /voice                       # Voice server
```

### Install dependencies

- [Node.js](https://nodejs.org/en) - LTS version recommended

### Local Development

```sh
# Rename .env.example to .env and update variables
mv .env.example web/.env

# Installing dependencies
npm install

# To start the app
npm run dev
```

This will start the [Next.js](https://nextjs.org) development server. When the above command completes you'll be able to view your website at `http://localhost:3000`

## Stack

This project uses the following libraries and services:

- Framework - [Next.js](https://nextjs.org)
- Styling - [Styled Components](https://styled-components.com/)
- API - [TRPC](https://trpc.io/)
- Database - [Postgres (Supabase)](https://supabase.com) + [Prisma](https://www.prisma.io)
- Hosting - [Vercel](https://vercel.com)
- Payments - [Stripe](https://stripe.com)
