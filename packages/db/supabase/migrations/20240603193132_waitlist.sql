create table if not exists
  public."Waitlist" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),
    "accountId" uuid references public."Accounts" ("id"),
    "email" text unique,
    primary key ("id")
  );
