# t3-template

An opinionated [t3 stack](https://create.t3.gg/) starter template.

## Features

In additional to the default t3 features, this template includes:

- [x] ~React Server Components~
- [x] ~Next.js Server Actions~
- [ ] CRUD Todo
- [ ] User Profile
- [ ] Payments
- [ ] Multi Tenancy
  - [ ] Admin Dashboard
- [ ] CLI generators
  - [ ] CRUD generator
  - [ ] UI generator

## FAQ

### Why use TRPC instead of just Server Actions?

TODO: tldr is that having a framework agnostic data layer lets us share logic between multiple clients (web, mobile, etc).

### Why pick Prisma over Drizzle?

TODO

### Why write a custom Auth.js adapter?

TODO

### Why write a custom `createServerAction` and `useServerAction` functions?

TODO

## References

The stack originates from and is updated with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
