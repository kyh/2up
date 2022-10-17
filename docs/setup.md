# Setting up your local development environment

## Initial setup

### Pre-requisites

- [Node.js](https://nodejs.org/en) - LTS version recommended
- [Docker](https://www.docker.com/products/docker-desktop) - For running the database locally
- [Supabase CLI](https://supabase.io/docs/cli/installing)

### Install dependencies and set up accounts

```sh
# Rename .env.example to .env and update variables
mv .env.example web/.env

# Installing dependencies
npm install
```

## Local Development

```sh
# To start the app
npm run dev
```

This will start the [Next.js](https://nextjs.org) development server. When the above command completes you'll be able to view your website at `http://localhost:3000`
