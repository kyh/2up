create table if not exists
  public.waitlist (
    id uuid unique not null default extensions.uuid_generate_v4 (),
    account_id uuid references public.accounts (id),
    email text unique,
    
    primary key (id)
  );
