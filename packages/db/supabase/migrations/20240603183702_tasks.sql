create type public.task_label as ENUM('bug', 'feature', 'enhancement', 'documentation');
create type public.task_priority as ENUM('low', 'medium', 'high');
create type public.task_status as ENUM('todo', 'in-progress', 'done', 'canceled');

create table if not exists
  public.tasks (
    id uuid unique not null default extensions.uuid_generate_v4 (),
    account_id uuid references public.accounts (id) on delete cascade not null,
    slug text unique,
    title text,
    status task_status default 'todo' not null,
    label task_label default 'bug' not null,
    priority task_priority default 'low' not null,
    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    primary key (id)
  );
