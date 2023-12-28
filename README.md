# template

An opinionated [t3 stack](https://create.t3.gg/) starter template.

## Features

In additional to the default t3 features, this template includes:

- [x] ~React Server Components~
- [x] ~Next.js Server Actions~
- [x] ~CRUD Todo~
- [x] ~Local Db~
- [ ] User Profile
- [ ] Payments
- [ ] Multi Tenancy
  - [ ] Admin Dashboard
- [ ] CLI generators
  - [ ] CRUD generator
  - [ ] UI generator

## FAQ

### Why use TRPC instead of just Server Actions?

Having a framework agnostic data layer lets us share logic between multiple clients (web, mobile, etc).

### Why pick Prisma over Drizzle?

Cross database support and a more mature ORM.

### Why write a custom Auth.js adapter?

TODO

## References

The stack originates from and is updated with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
