# Init

An opinionated [t3](https://create.t3.gg/) + [supabase](https://supabase.com/) starter template.

## Features

This template includes everything you need to build your own SaaS application:

- [x] ~React Server Components~
- [x] ~CRUD Todo~
- [x] ~Local Db~
- [ ] User Profile
- [ ] Multi Tenancy
- [ ] Billing
- [ ] Feedback System
- [ ] Notifications System
- [ ] Admin Dashboard
- [ ] Native Mobile App
- [ ] Native Desktop App
- [ ] CLI generators

## FAQ

### Why use TRPC instead of just Server Actions?

Having a framework agnostic data layer lets us share logic between multiple clients (web, mobile, etc).

### Why even have a data layer if you could query from client with Supabase?

TODO

### Why pick Prisma over Drizzle?

Cross database support and a more mature ORM.

## References

The stack originates from and is kept updated with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
