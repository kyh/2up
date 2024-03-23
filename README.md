# Init

A comprehensive boilerplate to build, launch, and scale your next project.

Built off [t3 turbo](https://github.com/t3-oss/create-t3-turbo) + [supabase](https://supabase.com).

## Features

- [x] ~CRUD~
- [x] ~Authentication~
- [x] ~MDX Documentation Site~
- [ ] User Profile
- [ ] Multi Tenancy
- [ ] Billing
- [ ] Submit Feedback System
- [ ] Notifications System
- [ ] Admin Dashboard
- [ ] Search
- [ ] Analytics
- [ ] Native Mobile App
- [ ] Native Desktop App
- [ ] Something something AI
- [ ] CLI generator
- [ ] [Taking Submissions](https://github.com/kyh/init/issues/new?assignees=&labels=%E2%9C%A8+enhancement&projects=&template=feature_request.yml&title=feat%3A+)

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

1. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

1. Start the development server:

```sh
pnpm dev
```

## License

Licensed under the [MIT license](https://github.com/kyh/init/blob/main/LICENSE).

## FAQ

### Why use TRPC instead of just Server Actions?

Having a framework agnostic data layer lets us share logic between multiple clients (web, mobile, etc).

### Why even have a data layer if you could query from client with Supabase?

TODO

### Why pick Prisma over Drizzle?

Cross database support and a more mature ORM.
