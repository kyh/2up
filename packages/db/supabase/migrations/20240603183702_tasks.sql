create type public."TaskLabel" as ENUM('bug', 'feature', 'enhancement', 'documentation');
create type public."TaskPriority" as ENUM('low', 'medium', 'high');
create type public."TaskStatus" as ENUM('todo', 'in-progress', 'done', 'canceled');

create table if not exists
  public."Tasks" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),
    "accountId" uuid references public."Accounts" ("id") on delete cascade not null,
    "slug" text unique,
    "title" text,
    "status" public."TaskStatus" default 'todo' not null,
    "label" public."TaskLabel" default 'bug' not null,
    "priority" public."TaskPriority" default 'low' not null,
    "updatedAt" timestamp with time zone,
    "createdAt" timestamptz not null default now(),
    "createdBy" uuid references auth."users",
    "updatedBy" uuid references auth."users",
    primary key ("id")
  );
