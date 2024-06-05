/*
 * -------------------------------------------------------
 * Supabase SaaS Starter Kit Schema
 * This is the schema for the Supabase SaaS Starter Kit.
 * It includes the schema for accounts, account roles, role permissions, memberships, invitations, subscriptions, and more.
 * -------------------------------------------------------
 */
/*
 * -------------------------------------------------------
 * Section: Revoke default privileges from public schema
 * We will revoke all default privileges from public schema on functions to prevent public access to them
 * -------------------------------------------------------
 */
-- Create a private Init schema
create schema if not exists kit;

create extension if not exists "unaccent" schema kit;

-- We remove all default privileges from public schema on functions to
--   prevent public access to them
alter default privileges
revoke
execute on functions
from
  public;

revoke all on schema public
from
  public;

revoke all PRIVILEGES on database "postgres"
from
  "anon";

revoke all PRIVILEGES on schema "public"
from
  "anon";

revoke all PRIVILEGES on schema "storage"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "public"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "storage"
from
  "anon";

-- We remove all default privileges from public schema on functions to
--   prevent public access to them by default
alter default privileges in schema public
revoke
execute on functions
from
  anon,
  authenticated;

-- we allow the authenticated role to execute functions in the public schema
grant usage on schema public to authenticated;

-- we allow the service_role role to execute functions in the public schema
grant usage on schema public to service_role;

/*
 * -------------------------------------------------------
 * Section: Enums
 * We create the enums for the schema
 * -------------------------------------------------------
 */
/*
* Permissions
- We create the permissions for the Supabase Init. These permissions are used to manage the permissions for the roles
- The permissions are 'roles.manage', 'billing.manage', 'settings.manage', 'members.manage', and 'invites.manage'.
- You can add more permissions as needed.
*/
create type public.app_permissions as enum(
  'roles.manage',
  'billing.manage',
  'settings.manage',
  'members.manage',
  'invites.manage'
);

/*
* Subscription Status
- We create the subscription status for the Supabase Init. These statuses are used to manage the status of the subscriptions
- The statuses are 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', and 'paused'.
- You can add more statuses as needed.
*/
create type public.subscription_status as ENUM(
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused'
);

/*
Payment Status
- We create the payment status for the Supabase Init. These statuses are used to manage the status of the payments
*/
create type public.payment_status as ENUM('pending', 'succeeded', 'failed');

/*
* Billing Provider
- We create the billing provider for the Supabase Init. These providers are used to manage the billing provider for the accounts
- The providers are 'stripe', 'lemon-squeezy', and 'paddle'.
- You can add more providers as needed.
*/
create type public.billing_provider as ENUM('stripe', 'lemon-squeezy', 'paddle');

/*
* Subscription Item Type
- We create the subscription item type for the Supabase Init. These types are used to manage the type of the subscription items
- The types are 'flat', 'per_seat', and 'metered'.
- You can add more types as needed.
*/
create type public.subscription_item_type as ENUM('flat', 'per_seat', 'metered');

/*
* Invitation Type
- We create the invitation type for the Supabase Init. These types are used to manage the type of the invitation
*/
create type public.invitation as (email text, role varchar(50));

/*
 * -------------------------------------------------------
 * Section: App Configuration
 * We create the configuration for the Supabase Init to enable or disable features
 * -------------------------------------------------------
 */
create table if not exists
  public.config (
    enable_team_accounts boolean default true not null,
    enable_account_billing boolean default true not null,
    enable_team_account_billing boolean default true not null,
    billing_provider public.billing_provider default 'stripe' not null
  );

comment on table public.config is 'Configuration for the Supabase Init.';

comment on column public.config.enable_team_accounts is 'Enable team accounts';

comment on column public.config.enable_account_billing is 'Enable billing for individual accounts';

comment on column public.config.enable_team_account_billing is 'Enable billing for team accounts';

comment on column public.config.billing_provider is 'The billing provider to use';

-- RLS(config)
alter table public.config enable row level security;

-- create config row
insert into
  public.config (
    enable_team_accounts,
    enable_account_billing,
    enable_team_account_billing
  )
values
  (true, true, true);

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.config
from
  authenticated,
  service_role;

-- Open up access to config table for authenticated users and service_role
grant
select
  on public.config to authenticated,
  service_role;

-- RLS
-- SELECT(config):
-- Authenticated users can read the config
create policy "public config can be read by authenticated users" on public.config for
select
  to authenticated using (true);

-- Function to get the config settings
create
or replace function public.get_config () returns json
set
  search_path = '' as $$
declare
    result record;
begin
    select
        *
    from
        public.config
    limit 1 into result;

    return row_to_json(result);

end;

$$ language plpgsql;

-- Automatically set timestamps on tables when a row is inserted or updated
create
or replace function public.trigger_set_timestamps () returns trigger
set
  search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        new.created_at = now();

        new.updated_at = now();

    else
        new.updated_at = now();

        new.created_at = old.created_at;

    end if;

    return NEW;

end
$$ language plpgsql;

-- Automatically set user tracking on tables when a row is inserted or updated
create
or replace function public.trigger_set_user_tracking () returns trigger
set
  search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        new.created_by = auth.uid();
        new.updated_by = auth.uid();

    else
        new.updated_by = auth.uid();

        new.created_by = old.created_by;

    end if;

    return NEW;

end
$$ language plpgsql;

grant
execute on function public.get_config () to authenticated,
service_role;

-- Function "public.is_set"
-- Check if a field is set in the config
create
or replace function public.is_set (field_name text) returns boolean
set
  search_path = '' as $$
declare
    result boolean;
begin
    execute format('select %I from public.config limit 1', field_name) into result;

    return result;

end;

$$ language plpgsql;

grant
execute on function public.is_set (text) to authenticated;

/*
 * -------------------------------------------------------
 * Section: Accounts
 * We create the schema for the accounts. Accounts are the top level entity in the Supabase Init. They can be team or personal accounts.
 * -------------------------------------------------------
 */
-- Accounts table
create table if not exists
  public.accounts (
    id uuid unique not null default extensions.uuid_generate_v4 (),
    primary_owner_user_id uuid references auth.users on delete cascade not null default auth.uid (),
    name varchar(255) not null,
    slug text unique,
    email varchar(320) unique,
    is_personal_account boolean default false not null,
    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    picture_url varchar(1000),
    public_data jsonb default '{}'::jsonb not null,
    primary key (id)
  );

comment on table public.accounts is 'Accounts are the top level entity in the Supabase Init. They can be team or personal accounts.';

comment on column public.accounts.is_personal_account is 'Whether the account is a personal account or not';

comment on column public.accounts.name is 'The name of the account';

comment on column public.accounts.slug is 'The slug of the account';

comment on column public.accounts.primary_owner_user_id is 'The primary owner of the account';

comment on column public.accounts.email is 'The email of the account. For teams, this is the email of the team (if any)';

-- Enable RLS on the accounts table
alter table "public"."accounts" enable row level security;

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.accounts
from
  authenticated,
  service_role;

-- Open up access to accounts
grant
select
,
  insert,
update,
delete on table public.accounts to authenticated,
service_role;

-- constraint that conditionally allows nulls on the slug ONLY if
--  personal_account is true
alter table public.accounts
add constraint accounts_slug_null_if_personal_account_true check (
  (
    is_personal_account = true
    and slug is null
  )
  or (
    is_personal_account = false
    and slug is not null
  )
);

-- Indexes
create index if not exists ix_accounts_primary_owner_user_id on public.accounts (primary_owner_user_id);

create index if not exists ix_accounts_is_personal_account on public.accounts (is_personal_account);

-- constraint to ensure that the primary_owner_user_id is unique for personal accounts
create unique index unique_personal_account on public.accounts (primary_owner_user_id)
where
  is_personal_account = true;

-- RLS on the accounts table
-- UPDATE(accounts):
-- Team owners can update their accounts
create policy accounts_self_update on public.accounts
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = primary_owner_user_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = primary_owner_user_id
  );

-- Function "public.transfer_team_account_ownership"
-- Function to transfer the ownership of a team account to another user
create
or replace function public.transfer_team_account_ownership (target_account_id uuid, new_owner_id uuid) returns void
set
  search_path = '' as $$
begin
    if current_user not in('service_role') then
        raise exception 'You do not have permission to transfer account ownership';
    end if;

    -- verify the user is already a member of the account
    if not exists(
        select
            1
        from
            public.accounts_memberships
        where
            target_account_id = account_id
            and user_id = new_owner_id) then
        raise exception 'The new owner must be a member of the account';
    end if;

    -- update the primary owner of the account
    update
        public.accounts
    set
        primary_owner_user_id = new_owner_id
    where
        id = target_account_id
        and is_personal_account = false;

    -- update membership assigning it the hierarchy role
    update
        public.accounts_memberships
    set
        account_role =(
            public.get_upper_system_role())
    where
        target_account_id = account_id
        and user_id = new_owner_id
        and account_role <>(
            public.get_upper_system_role());

end;

$$ language plpgsql;

grant
execute on function public.transfer_team_account_ownership (uuid, uuid) to service_role;

-- Function "public.is_account_owner"
-- Function to check if a user is the primary owner of an account
create
or replace function public.is_account_owner (account_id uuid) returns boolean
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public.accounts
            where
                id = is_account_owner.account_id
                and primary_owner_user_id = auth.uid());
$$ language sql;

grant
execute on function public.is_account_owner (uuid) to authenticated,
service_role;

-- Function "kit.protect_account_fields"
-- Function to protect account fields from being updated
create
or replace function kit.protect_account_fields () returns trigger as $$
begin
    if current_user in('authenticated', 'anon') then
	if new.id <> old.id or new.is_personal_account <>
	    old.is_personal_account or new.primary_owner_user_id <>
	    old.primary_owner_user_id or new.email <> old.email then
            raise exception 'You do not have permission to update this field';

        end if;

    end if;

    return NEW;

end
$$ language plpgsql
set
  search_path = '';

-- trigger to protect account fields
create trigger protect_account_fields before
update on public.accounts for each row
execute function kit.protect_account_fields ();

-- Function "public.get_upper_system_role"
-- Function to get the highest system role for an account
create
or replace function public.get_upper_system_role () returns varchar
set
  search_path = '' as $$
declare
    role varchar(50);
begin
    select name from public.roles
      where hierarchy_level = 1 into role;

    return role;
end;
$$ language plpgsql;

grant
execute on function public.get_upper_system_role () to service_role;

-- Function "kit.add_current_user_to_new_account"
-- Trigger to add the current user to a new account as the primary owner
create
or replace function kit.add_current_user_to_new_account () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    if new.primary_owner_user_id = auth.uid() then
        insert into public.accounts_memberships(
            account_id,
            user_id,
            account_role)
        values(
            new.id,
            auth.uid(),
            public.get_upper_system_role());

    end if;

    return NEW;

end;

$$;

-- trigger the function whenever a new account is created
create trigger "add_current_user_to_new_account"
after insert on public.accounts for each row
execute function kit.add_current_user_to_new_account ();

-- create a trigger to update the account email when the primary owner email is updated
create
or replace function kit.handle_update_user_email () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    update
        public.accounts
    set
        email = new.email
    where
        primary_owner_user_id = new.id
        and is_personal_account = true;

    return new;

end;

$$;

-- trigger the function every time a user email is updated only if the user is the primary owner of the account and
-- the account is personal account
create trigger "on_auth_user_updated"
after
update of email on auth.users for each row
execute procedure kit.handle_update_user_email ();

/*
 * -------------------------------------------------------
 * Section: Roles
 * We create the schema for the roles. Roles are the roles for an account. For example, an account might have the roles 'owner', 'admin', and 'member'.
 * -------------------------------------------------------
 */
-- Roles Table
create table if not exists
  public.roles (
    name varchar(50) not null,
    hierarchy_level int not null check (hierarchy_level > 0),
    primary key (name),
    unique (hierarchy_level)
  );

-- Revoke all on roles table from authenticated and service_role
revoke all on public.roles
from
  authenticated,
  service_role;

-- Open up access to roles table for authenticated users and service_role
grant
select
on table public.roles to authenticated,
service_role;

-- RLS
alter table public.roles enable row level security;

/*
 * -------------------------------------------------------
 * Section: Memberships
 * We create the schema for the memberships. Memberships are the memberships for an account. For example, a user might be a member of an account with the role 'owner'.
 * -------------------------------------------------------
 */
-- Account Memberships table
create table if not exists
  public.accounts_memberships (
    user_id uuid references auth.users on delete cascade not null,
    account_id uuid references public.accounts (id) on delete cascade not null,
    account_role varchar(50) references public.roles (name) not null,
    created_at timestamptz default current_timestamp not null,
    updated_at timestamptz default current_timestamp not null,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    primary key (user_id, account_id)
  );

comment on table public.accounts_memberships is 'The memberships for an account';

comment on column public.accounts_memberships.account_id is 'The account the membership is for';

comment on column public.accounts_memberships.account_role is 'The role for the membership';

-- Revoke all on accounts_memberships table from authenticated and service_role
revoke all on public.accounts_memberships
from
  authenticated,
  service_role;

-- Open up access to accounts_memberships table for authenticated users and service_role
grant
select
,
  insert,
update,
delete on table public.accounts_memberships to authenticated,
service_role;

-- Indexes on the accounts_memberships table
create index ix_accounts_memberships_account_id on public.accounts_memberships (account_id);

create index ix_accounts_memberships_user_id on public.accounts_memberships (user_id);

create index ix_accounts_memberships_account_role on public.accounts_memberships (account_role);

-- Enable RLS on the accounts_memberships table
alter table public.accounts_memberships enable row level security;

-- Function "kit.prevent_account_owner_membership_delete"
-- Trigger to prevent a primary owner from being removed from an account
create
or replace function kit.prevent_account_owner_membership_delete () returns trigger
set
  search_path = '' as $$
begin
    if exists(
        select
            1
        from
            public.accounts
        where
            id = old.account_id
            and primary_owner_user_id = old.user_id) then
    raise exception 'The primary account owner cannot be removed from the account membership list';

end if;

    return old;

end;

$$ language plpgsql;

create
or replace trigger prevent_account_owner_membership_delete_check before delete on public.accounts_memberships for each row
execute function kit.prevent_account_owner_membership_delete ();

-- Function "kit.prevent_memberships_update"
-- Trigger to prevent updates to account memberships with the exception of the account_role
create
or replace function kit.prevent_memberships_update () returns trigger
set
  search_path = '' as $$
begin
    if new.account_role <> old.account_role then
        return new;
    end if;

    raise exception 'Only the account_role can be updated';

end; $$ language plpgsql;

create
or replace trigger prevent_memberships_update_check before
update on public.accounts_memberships for each row
execute function kit.prevent_memberships_update ();

-- Function "public.has_role_on_account"
-- Function to check if a user has a role on an account
create
or replace function public.has_role_on_account (
  account_id uuid,
  account_role varchar(50) default null
) returns boolean language sql security definer
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public.accounts_memberships membership
            where
                membership.user_id = (select auth.uid())
                and membership.account_id = has_role_on_account.account_id
                and((membership.account_role = has_role_on_account.account_role
                    or has_role_on_account.account_role is null)));
$$;

grant
execute on function public.has_role_on_account (uuid, varchar) to authenticated;

-- Function "public.is_team_member"
-- Check if a user is a team member of an account or not
create
or replace function public.is_team_member (account_id uuid, user_id uuid) returns boolean language sql security definer
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public.accounts_memberships membership
            where
                public.has_role_on_account(account_id)
                and membership.user_id = is_team_member.user_id
                and membership.account_id = is_team_member.account_id);
$$;

grant
execute on function public.is_team_member (uuid, uuid) to authenticated,
service_role;

-- RLS
-- SELECT(roles)
-- authenticated users can query roles
create policy roles_read on public.roles for
select
  to authenticated using (
    true
  );

-- Function "public.can_action_account_member"
-- Check if a user can perform management actions on an account member
create
or replace function public.can_action_account_member (target_team_account_id uuid, target_user_id uuid) returns boolean
set
  search_path = '' as $$
declare
    permission_granted boolean;
    target_user_hierarchy_level int;
    current_user_hierarchy_level int;
    is_account_owner boolean;
    target_user_role varchar(50);
begin
    if target_user_id = auth.uid() then
      raise exception 'You cannot update your own account membership with this function';
    end if;

    -- an account owner can action any member of the account
    if public.is_account_owner(target_team_account_id) then
      return true;
    end if;

     -- check the target user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_team_account_id
                and primary_owner_user_id = target_user_id) into is_account_owner;

    if is_account_owner then
        raise exception 'The primary account owner cannot be actioned';
    end if;

    -- validate the auth user has the required permission on the account
    -- to manage members of the account
    select
 public.has_permission(auth.uid(), target_team_account_id,
     'members.manage'::public.app_permissions) into
     permission_granted;

    -- if the user does not have the required permission, raise an exception
    if not permission_granted then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    -- get the role of the target user
    select
        am.account_role,
        r.hierarchy_level
    from
        public.accounts_memberships as am
    join
        public.roles as r on am.account_role = r.name
    where
        am.account_id = target_team_account_id
        and am.user_id = target_user_id
    into target_user_role, target_user_hierarchy_level;

    -- get the hierarchy level of the current user
    select
        r.hierarchy_level into current_user_hierarchy_level
    from
        public.roles as r
    join
        public.accounts_memberships as am on r.name = am.account_role
    where
        am.account_id = target_team_account_id
        and am.user_id = auth.uid();

    if target_user_role is null then
      raise exception 'The target user does not have a role on the account';
    end if;

    if current_user_hierarchy_level is null then
      raise exception 'The current user does not have a role on the account';
    end if;

    -- check the current user has a higher role than the target user
    if current_user_hierarchy_level >= target_user_hierarchy_level then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    return true;

end;

$$ language plpgsql;

grant
execute on function public.can_action_account_member (uuid, uuid) to authenticated,
service_role;

-- RLS
-- SELECT(accounts_memberships):
-- Users can read their team members account memberships
create policy accounts_memberships_read on public.accounts_memberships for
select
  to authenticated using (
    (
      (
        select
          auth.uid ()
      ) = user_id
    )
    or is_team_member (account_id, user_id)
  );

create
or replace function public.is_account_team_member (target_account_id uuid) returns boolean
set
  search_path = '' as $$
    select exists(
        select 1
        from public.accounts_memberships as membership
        where public.is_team_member (membership.account_id, target_account_id)
    );
$$ language sql;

grant
execute on function public.is_account_team_member (uuid) to authenticated,
service_role;

-- RLS on the accounts table
-- SELECT(accounts):
-- Users can read the an account if
--   - they are the primary owner of the account
--   - they have a role on the account
--   - they are reading an account of the same team
create policy accounts_read on public.accounts for
select
  to authenticated using (
    (
      (
        select
          auth.uid ()
      ) = primary_owner_user_id
    )
    or public.has_role_on_account (id)
    or public.is_account_team_member (id)
  );

-- DELETE(accounts_memberships):
-- Users with the required role can remove members from an account or remove their own
create policy accounts_memberships_delete on public.accounts_memberships for delete to authenticated using (
  (
    user_id = (
      select
        auth.uid ()
    )
  )
  or public.can_action_account_member (account_id, user_id)
);

/*
 * -------------------------------------------------------
 * Section: Role Permissions
 * We create the schema for the role permissions. Role permissions are the permissions for a role.
 * For example, the 'owner' role might have the 'roles.manage' permission.
 * -------------------------------------------------------
 */
-- Create table for roles permissions
create table if not exists
  public.role_permissions (
    id bigint generated by default as identity primary key,
    role varchar(50) references public.roles (name) not null,
    permission public.app_permissions not null,
    unique (role, permission)
  );

comment on table public.role_permissions is 'The permissions for a role';

comment on column public.role_permissions.role is 'The role the permission is for';

comment on column public.role_permissions.permission is 'The permission for the role';

-- Indexes on the role_permissions table
create index ix_role_permissions_role on public.role_permissions (role);

-- Revoke all on role_permissions table from authenticated and service_role
revoke all on public.role_permissions
from
  authenticated,
  service_role;

-- Open up access to role_permissions table for authenticated users and service_role
grant
select
,
  insert,
update,
delete on table public.role_permissions to service_role;

-- Authenticated users can read role permissions
grant
select
  on table public.role_permissions to authenticated;

-- Function "public.has_permission"
-- Create a function to check if a user has a permission
create
or replace function public.has_permission (
  user_id uuid,
  account_id uuid,
  permission_name public.app_permissions
) returns boolean
set
  search_path = '' as $$
begin
    return exists(
        select
            1
        from
            public.accounts_memberships
	    join public.role_permissions on
		accounts_memberships.account_role =
		role_permissions.role
        where
            accounts_memberships.user_id = has_permission.user_id
            and accounts_memberships.account_id = has_permission.account_id
            and role_permissions.permission = has_permission.permission_name);

end;

$$ language plpgsql;

grant
execute on function public.has_permission (uuid, uuid, public.app_permissions) to authenticated,
service_role;

-- Function "public.has_more_elevated_role"
-- Check if a user has a more elevated role than the target role
create
or replace function public.has_more_elevated_role (
  target_user_id uuid,
  target_account_id uuid,
  role_name varchar
) returns boolean
set
  search_path = '' as $$
declare
    declare is_primary_owner boolean;
    user_role_hierarchy_level int;
    target_role_hierarchy_level int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_account_id
                and primary_owner_user_id = target_user_id) into is_primary_owner;

    -- If the user is the primary owner, they have the highest role and can
    --   perform any action
    if is_primary_owner then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        hierarchy_level into user_role_hierarchy_level
    from
        public.roles
    where
        name =(
            select
                account_role
            from
                public.accounts_memberships
            where
                account_id = target_account_id
                and target_user_id = user_id);

    if user_role_hierarchy_level is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        hierarchy_level into target_role_hierarchy_level
    from
        public.roles
    where
        name = role_name;

    -- If the target role does not exist, the user cannot perform the action
    if target_role_hierarchy_level is null then
        return false;
    end if;

    -- If the user's role is higher than the target role, they can perform
    --   the action
    return user_role_hierarchy_level < target_role_hierarchy_level;

end;

$$ language plpgsql;

grant
execute on function public.has_more_elevated_role (uuid, uuid, varchar) to authenticated,
service_role;

-- Function "public.has_same_role_hierarchy_level"
-- Check if a user has the same role hierarchy level as the target role
create
or replace function public.has_same_role_hierarchy_level (
  target_user_id uuid,
  target_account_id uuid,
  role_name varchar
) returns boolean
set
  search_path = '' as $$
declare
    is_primary_owner boolean;
    user_role_hierarchy_level int;
    target_role_hierarchy_level int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_account_id
                and primary_owner_user_id = target_user_id) into is_primary_owner;

    -- If the user is the primary owner, they have the highest role and can perform any action
    if is_primary_owner then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        hierarchy_level into user_role_hierarchy_level
    from
        public.roles
    where
        name =(
            select
                account_role
            from
                public.accounts_memberships
            where
                account_id = target_account_id
                and target_user_id = user_id);

    -- If the user does not have a role in the account, they cannot perform the action
    if user_role_hierarchy_level is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        hierarchy_level into target_role_hierarchy_level
    from
        public.roles
    where
        name = role_name;

    -- If the target role does not exist, the user cannot perform the action
    if target_role_hierarchy_level is null then
        return false;
    end if;

   -- check the user's role hierarchy level is the same as the target role
    return user_role_hierarchy_level = target_role_hierarchy_level;

end;

$$ language plpgsql;

grant
execute on function public.has_same_role_hierarchy_level (uuid, uuid, varchar) to authenticated,
service_role;

-- Enable RLS on the role_permissions table
alter table public.role_permissions enable row level security;

-- RLS on the role_permissions table
-- SELECT(role_permissions):
-- Authenticated Users can read global permissions
create policy role_permissions_read on public.role_permissions for
select
  to authenticated using (true);

/*
 * -------------------------------------------------------
 * Section: Invitations
 * We create the schema for the invitations. Invitations are the invitations for an account sent to a user to join the account.
 * -------------------------------------------------------
 */
create table if not exists
  public.invitations (
    id serial primary key,
    email varchar(255) not null,
    account_id uuid references public.accounts (id) on delete cascade not null,
    invited_by uuid references auth.users on delete cascade not null,
    role varchar(50) references public.roles (name) not null,
    invite_token varchar(255) unique not null,
    created_at timestamptz default current_timestamp not null,
    updated_at timestamptz default current_timestamp not null,
    expires_at timestamptz default current_timestamp + interval '7 days' not null,
    unique (email, account_id)
  );

comment on table public.invitations is 'The invitations for an account';

comment on column public.invitations.account_id is 'The account the invitation is for';

comment on column public.invitations.invited_by is 'The user who invited the user';

comment on column public.invitations.role is 'The role for the invitation';

comment on column public.invitations.invite_token is 'The token for the invitation';

comment on column public.invitations.expires_at is 'The expiry date for the invitation';

comment on column public.invitations.email is 'The email of the user being invited';

-- Indexes on the invitations table
create index ix_invitations_account_id on public.invitations (account_id);

-- Revoke all on invitations table from authenticated and service_role
revoke all on public.invitations
from
  authenticated,
  service_role;

-- Open up access to invitations table for authenticated users and service_role
grant
select
,
  insert,
update,
delete on table public.invitations to authenticated,
service_role;

-- Enable RLS on the invitations table
alter table public.invitations enable row level security;

-- Function "kit.check_team_account"
-- Function to check if the account is a team account or not when inserting or updating an invitation
create
or replace function kit.check_team_account () returns trigger
set
  search_path = '' as $$
begin
    if(
        select
            is_personal_account
        from
            public.accounts
        where
            id = new.account_id) then
        raise exception 'Account must be an team account';

    end if;

    return NEW;

end;

$$ language plpgsql;

create trigger only_team_accounts_check before insert
or
update on public.invitations for each row
execute procedure kit.check_team_account ();

-- RLS on the invitations table
-- SELECT(invitations):
-- Users can read invitations to users of an account they are a member of
create policy invitations_read_self on public.invitations for
select
  to authenticated using (public.has_role_on_account (account_id));

-- INSERT(invitations):
-- Users can create invitations to users of an account they are
-- a member of  and have the 'invites.manage' permission AND the target role is not higher than the user's role
create policy invitations_create_self on public.invitations for insert to authenticated
with
  check (
    public.is_set ('enable_team_accounts')
    and public.has_permission (
      (
        select
          auth.uid ()
      ),
      account_id,
      'invites.manage'::public.app_permissions
    )
    and public.has_same_role_hierarchy_level (
      (
        select
          auth.uid ()
      ),
      account_id,
      role
    )
  );

-- UPDATE(invitations):
-- Users can update invitations to users of an account they are a member of and have the 'invites.manage' permission AND
-- the target role is not higher than the user's role
create policy invitations_update on public.invitations
for update
  to authenticated using (
    public.has_permission (
      (
        select
          auth.uid ()
      ),
      account_id,
      'invites.manage'::public.app_permissions
    )
    and public.has_more_elevated_role (
      (
        select
          auth.uid ()
      ),
      account_id,
      role
    )
  )
with
  check (
    public.has_permission (
      (
        select
          auth.uid ()
      ),
      account_id,
      'invites.manage'::public.app_permissions
    )
    and public.has_more_elevated_role (
      (
        select
          auth.uid ()
      ),
      account_id,
      role
    )
  );

-- DELETE(public.invitations):
-- Users can delete invitations to users of an account they are a member of and have the 'invites.manage' permission
create policy invitations_delete on public.invitations for delete to authenticated using (
  has_role_on_account (account_id)
  and public.has_permission (
    (
      select
        auth.uid ()
    ),
    account_id,
    'invites.manage'::public.app_permissions
  )
);

-- Functions "public.accept_invitation"
-- Function to accept an invitation to an account
create
or replace function accept_invitation (token text, user_id uuid) returns uuid
set
  search_path = '' as $$
declare
    target_account_id uuid;
    target_role varchar(50);
begin
    select
        account_id,
        role into target_account_id,
        target_role
    from
        public.invitations
    where
        invite_token = token
        and expires_at > now();

    if not found then
        raise exception 'Invalid or expired invitation token';
    end if;

    insert into public.accounts_memberships(
        user_id,
        account_id,
        account_role)
    values (
        accept_invitation.user_id,
        target_account_id,
        target_role);

    delete from public.invitations
    where invite_token = token;

    return target_account_id;
end;

$$ language plpgsql;

grant
execute on function accept_invitation (text, uuid) to service_role;

/*
 * -------------------------------------------------------
 * Section: Billing Customers
 * We create the schema for the billing customers. Billing customers are the customers for an account in the billing provider. For example, a user might have a customer in the billing provider with the customer ID 'cus_123'.
 * -------------------------------------------------------
 */
-- Account Subscriptions table
create table
  public.billing_customers (
    account_id uuid references public.accounts (id) on delete cascade not null,
    id serial primary key,
    email text,
    provider public.billing_provider not null,
    customer_id text not null,
    unique (account_id, customer_id, provider)
  );

comment on table public.billing_customers is 'The billing customers for an account';

comment on column public.billing_customers.account_id is 'The account the billing customer is for';

comment on column public.billing_customers.provider is 'The provider of the billing customer';

comment on column public.billing_customers.customer_id is 'The customer ID for the billing customer';

comment on column public.billing_customers.email is 'The email of the billing customer';

-- Indexes on the billing_customers table
create index ix_billing_customers_account_id on public.billing_customers (account_id);

-- Revoke all on billing_customers table from authenticated and service_role
revoke all on public.billing_customers
from
  authenticated,
  service_role;

-- Open up relevant access to billing_customers table for authenticated users and service_role
grant
select
,
  insert,
update,
delete on table public.billing_customers to service_role;

-- Open up access to billing_customers table for authenticated users
grant
select
  on table public.billing_customers to authenticated,
  service_role;

-- Enable RLS on billing_customers table
alter table public.billing_customers enable row level security;

-- RLS on the billing_customers table
-- SELECT(billing_customers):
-- Users can read account subscriptions on an account they are a member of
create policy billing_customers_read_self on public.billing_customers for
select
  to authenticated using (
    account_id = (
      select
        auth.uid ()
    )
    or has_role_on_account (account_id)
  );

/*
 * -------------------------------------------------------
 * Section: Subscriptions
 * We create the schema for the subscriptions. Subscriptions are the subscriptions for an account to a product. For example, a user might have a subscription to a product with the status 'active'.
 * -------------------------------------------------------
 */
-- Subscriptions table
create table if not exists
  public.subscriptions (
    id text not null primary key,
    account_id uuid references public.accounts (id) on delete cascade not null,
    billing_customer_id int references public.billing_customers on delete cascade not null,
    status public.subscription_status not null,
    active bool not null,
    billing_provider public.billing_provider not null,
    cancel_at_period_end bool not null,
    currency varchar(3) not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    period_starts_at timestamptz not null,
    period_ends_at timestamptz not null,
    trial_starts_at timestamptz,
    trial_ends_at timestamptz
  );

comment on table public.subscriptions is 'The subscriptions for an account';

comment on column public.subscriptions.account_id is 'The account the subscription is for';

comment on column public.subscriptions.billing_provider is 'The provider of the subscription';

comment on column public.subscriptions.cancel_at_period_end is 'Whether the subscription will be canceled at the end of the period';

comment on column public.subscriptions.currency is 'The currency for the subscription';

comment on column public.subscriptions.status is 'The status of the subscription';

comment on column public.subscriptions.period_starts_at is 'The start of the current period for the subscription';

comment on column public.subscriptions.period_ends_at is 'The end of the current period for the subscription';

comment on column public.subscriptions.trial_starts_at is 'The start of the trial period for the subscription';

comment on column public.subscriptions.trial_ends_at is 'The end of the trial period for the subscription';

comment on column public.subscriptions.active is 'Whether the subscription is active';

comment on column public.subscriptions.billing_customer_id is 'The billing customer ID for the subscription';

-- Revoke all on subscriptions table from authenticated and service_role
revoke all on public.subscriptions
from
  authenticated,
  service_role;

-- Open up relevant access to subscriptions table for authenticated users and service_role
grant
select
,
  insert,
update,
delete on table public.subscriptions to service_role;

grant
select
  on table public.subscriptions to authenticated;

-- Indexes on the subscriptions table
create index ix_subscriptions_account_id on public.subscriptions (account_id);

-- Enable RLS on subscriptions table
alter table public.subscriptions enable row level security;

-- RLS on the subscriptions table
-- SELECT(subscriptions):
-- Users can read account subscriptions on an account they are a member of
create policy subscriptions_read_self on public.subscriptions for
select
  to authenticated using (
    (
      has_role_on_account (account_id)
      and public.is_set ('enable_team_account_billing')
    )
    or (
      account_id = (
        select
          auth.uid ()
      )
      and public.is_set ('enable_account_billing')
    )
  );

-- Function "public.upsert_subscription"
-- Insert or Update a subscription and its items in the database when receiving a webhook from the billing provider
create
or replace function public.upsert_subscription (
  target_account_id uuid,
  target_customer_id varchar(255),
  target_subscription_id text,
  active bool,
  status public.subscription_status,
  billing_provider public.billing_provider,
  cancel_at_period_end bool,
  currency varchar(3),
  period_starts_at timestamptz,
  period_ends_at timestamptz,
  line_items jsonb,
  trial_starts_at timestamptz default null,
  trial_ends_at timestamptz default null
) returns public.subscriptions
set
  search_path = '' as $$
declare
    new_subscription public.subscriptions;
    new_billing_customer_id int;
begin
    insert into public.billing_customers(
        account_id,
        provider,
        customer_id)
    values (
        target_account_id,
        billing_provider,
        target_customer_id)
on conflict (
    account_id,
    provider,
    customer_id)
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public.subscriptions(
        account_id,
        billing_customer_id,
        id,
        active,
        status,
        billing_provider,
        cancel_at_period_end,
        currency,
        period_starts_at,
        period_ends_at,
        trial_starts_at,
        trial_ends_at)
    values (
        target_account_id,
        new_billing_customer_id,
        target_subscription_id,
        active,
        status,
        billing_provider,
        cancel_at_period_end,
        currency,
        period_starts_at,
        period_ends_at,
        trial_starts_at,
        trial_ends_at)
on conflict (
    id)
    do update set
        active = excluded.active,
        status = excluded.status,
        cancel_at_period_end = excluded.cancel_at_period_end,
        currency = excluded.currency,
        period_starts_at = excluded.period_starts_at,
        period_ends_at = excluded.period_ends_at,
        trial_starts_at = excluded.trial_starts_at,
        trial_ends_at = excluded.trial_ends_at
    returning
        * into new_subscription;

    -- Upsert subscription items and delete ones that are not in the line_items array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as line_item_id,
            (line_item ->> 'product_id')::varchar as prod_id,
            (line_item ->> 'variant_id')::varchar as var_id,
            (line_item ->> 'type')::public.subscription_item_type as type,
            (line_item ->> 'price_amount')::numeric as price_amt,
            (line_item ->> 'quantity')::integer as qty,
            (line_item ->> 'interval')::varchar as intv,
            (line_item ->> 'interval_count')::integer as intv_count
        from
            jsonb_array_elements(line_items) as line_item
    ),
    line_item_ids as (
        select line_item_id from item_data
    ),
    deleted_items as (
        delete from
            public.subscription_items
        where
            public.subscription_items.subscription_id = new_subscription.id
            and public.subscription_items.id not in (select line_item_id from line_item_ids)
        returning *
    )
    insert into public.subscription_items(
        id,
        subscription_id,
        product_id,
        variant_id,
        type,
        price_amount,
        quantity,
        interval,
        interval_count)
    select
        line_item_id,
        target_subscription_id,
        prod_id,
        var_id,
        type,
        price_amt,
        qty,
        intv,
        intv_count
    from
        item_data
    on conflict (id)
        do update set
            product_id = excluded.product_id,
            variant_id = excluded.variant_id,
            price_amount = excluded.price_amount,
            quantity = excluded.quantity,
            interval = excluded.interval,
            type = excluded.type,
            interval_count = excluded.interval_count;

    return new_subscription;

end;

$$ language plpgsql;

grant
execute on function public.upsert_subscription (
  uuid,
  varchar,
  text,
  bool,
  public.subscription_status,
  public.billing_provider,
  bool,
  varchar,
  timestamptz,
  timestamptz,
  jsonb,
  timestamptz,
  timestamptz
) to service_role;

/* -------------------------------------------------------
* Section: Subscription Items
* We create the schema for the subscription items. Subscription items are the items in a subscription.
* For example, a subscription might have a subscription item with the product ID 'prod_123' and the variant ID 'var_123'.
* -------------------------------------------------------
*/
create table if not exists
  public.subscription_items (
    id varchar(255) not null primary key,
    subscription_id text references public.subscriptions (id) on delete cascade not null,
    product_id varchar(255) not null,
    variant_id varchar(255) not null,
    type public.subscription_item_type not null,
    price_amount numeric,
    quantity integer not null default 1,
    interval varchar(255) not null,
    interval_count integer not null check (interval_count > 0),
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (subscription_id, product_id, variant_id)
  );

comment on table public.subscription_items is 'The items in a subscription';

comment on column public.subscription_items.subscription_id is 'The subscription the item is for';

comment on column public.subscription_items.product_id is 'The product ID for the item';

comment on column public.subscription_items.variant_id is 'The variant ID for the item';

comment on column public.subscription_items.price_amount is 'The price amount for the item';

comment on column public.subscription_items.quantity is 'The quantity of the item';

comment on column public.subscription_items.interval is 'The interval for the item';

comment on column public.subscription_items.interval_count is 'The interval count for the item';

comment on column public.subscription_items.created_at is 'The creation date of the item';

comment on column public.subscription_items.updated_at is 'The last update date of the item';

-- Revoke all access to subscription_items table for authenticated users and service_role
revoke all on public.subscription_items
from
  authenticated,
  service_role;

-- Open up relevant access to subscription_items table for authenticated users and service_role
grant
select
  on table public.subscription_items to authenticated,
  service_role;

grant insert,
update,
delete on table public.subscription_items to service_role;

-- Indexes
-- Indexes on the subscription_items table
create index ix_subscription_items_subscription_id on public.subscription_items (subscription_id);

-- RLS
alter table public.subscription_items enable row level security;

-- SELECT(subscription_items)
-- Users can read subscription items on a subscription they are a member of
create policy subscription_items_read_self on public.subscription_items for
select
  to authenticated using (
    exists (
      select
        1
      from
        public.subscriptions
      where
        id = subscription_id
        and (
          account_id = (
            select
              auth.uid ()
          )
          or has_role_on_account (account_id)
        )
    )
  );

/**
 * -------------------------------------------------------
 * Section: Orders
 * We create the schema for the subscription items. Subscription items are the items in a subscription.
 * For example, a subscription might have a subscription item with the product ID 'prod_123' and the variant ID 'var_123'.
 * -------------------------------------------------------
 */
create table if not exists
  public.orders (
    id text not null primary key,
    account_id uuid references public.accounts (id) on delete cascade not null,
    billing_customer_id int references public.billing_customers on delete cascade not null,
    status public.payment_status not null,
    billing_provider public.billing_provider not null,
    total_amount numeric not null,
    currency varchar(3) not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
  );

comment on table public.orders is 'The one-time orders for an account';

comment on column public.orders.account_id is 'The account the order is for';

comment on column public.orders.billing_provider is 'The provider of the order';

comment on column public.orders.total_amount is 'The total amount for the order';

comment on column public.orders.currency is 'The currency for the order';

comment on column public.orders.status is 'The status of the order';

comment on column public.orders.billing_customer_id is 'The billing customer ID for the order';

-- Revoke all access to orders table for authenticated users and service_role
revoke all on public.orders
from
  authenticated,
  service_role;

-- Open up access to orders table for authenticated users and service_role
grant
select
  on table public.orders to authenticated;

grant
select
,
  insert,
update,
delete on table public.orders to service_role;

-- Indexes
-- Indexes on the orders table
create index ix_orders_account_id on public.orders (account_id);

-- RLS
alter table public.orders enable row level security;

-- SELECT(orders)
-- Users can read orders on an account they are a member of or the account is their own
create policy orders_read_self on public.orders for
select
  to authenticated using (
    (
      account_id = (
        select
          auth.uid ()
      )
      and public.is_set ('enable_account_billing')
    )
    or (
      has_role_on_account (account_id)
      and public.is_set ('enable_team_account_billing')
    )
  );

/**
 * -------------------------------------------------------
 * Section: Order Items
 * We create the schema for the order items. Order items are the items in an order.
 * -------------------------------------------------------
 */
create table if not exists
  public.order_items (
    id text not null primary key,
    order_id text references public.orders (id) on delete cascade not null,
    product_id text not null,
    variant_id text not null,
    price_amount numeric,
    quantity integer not null default 1,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (order_id, product_id, variant_id)
  );

comment on table public.order_items is 'The items in an order';

comment on column public.order_items.order_id is 'The order the item is for';

comment on column public.order_items.order_id is 'The order the item is for';

comment on column public.order_items.product_id is 'The product ID for the item';

comment on column public.order_items.variant_id is 'The variant ID for the item';

comment on column public.order_items.price_amount is 'The price amount for the item';

comment on column public.order_items.quantity is 'The quantity of the item';

comment on column public.order_items.created_at is 'The creation date of the item';

comment on column public.order_items.updated_at is 'The last update date of the item';

-- Revoke all access to order_items table for authenticated users and service_role
revoke all on public.order_items
from
  authenticated,
  service_role;

-- Open up relevant access to order_items table for authenticated users and service_role
grant
select
  on table public.order_items to authenticated,
  service_role;

grant insert on table public.order_items to service_role;

-- Indexes on the order_items table
create index ix_order_items_order_id on public.order_items (order_id);

-- RLS
alter table public.order_items enable row level security;

-- SELECT(order_items):
-- Users can read order items on an order they are a member of
create policy order_items_read_self on public.order_items for
select
  to authenticated using (
    exists (
      select
        1
      from
        public.orders
      where
        id = order_id
        and (
          account_id = (
            select
              auth.uid ()
          )
          or has_role_on_account (account_id)
        )
    )
  );

-- Function "public.upsert_order"
-- Insert or update an order and its items when receiving a webhook from the billing provider
create
or replace function public.upsert_order (
  target_account_id uuid,
  target_customer_id varchar(255),
  target_order_id text,
  status public.payment_status,
  billing_provider public.billing_provider,
  total_amount numeric,
  currency varchar(3),
  line_items jsonb
) returns public.orders
set
  search_path = '' as $$
declare
    new_order public.orders;
    new_billing_customer_id int;
begin
    insert into public.billing_customers(
        account_id,
        provider,
        customer_id)
    values (
        target_account_id,
        billing_provider,
        target_customer_id)
on conflict (
    account_id,
    provider,
    customer_id)
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public.orders(
        account_id,
        billing_customer_id,
        id,
        status,
        billing_provider,
        total_amount,
        currency)
    values (
        target_account_id,
        new_billing_customer_id,
        target_order_id,
        status,
        billing_provider,
        total_amount,
        currency)
on conflict (
    id)
    do update set
        status = excluded.status,
        total_amount = excluded.total_amount,
        currency = excluded.currency
    returning
        * into new_order;

    -- Upsert order items and delete ones that are not in the line_items array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as line_item_id,
            (line_item ->> 'product_id')::varchar as prod_id,
            (line_item ->> 'variant_id')::varchar as var_id,
            (line_item ->> 'price_amount')::numeric as price_amt,
            (line_item ->> 'quantity')::integer as qty
        from
            jsonb_array_elements(line_items) as line_item
    ),
    line_item_ids as (
        select line_item_id from item_data
    ),
    deleted_items as (
        delete from
            public.order_items
        where
            public.order_items.order_id = new_order.id
            and public.order_items.id not in (select line_item_id from line_item_ids)
        returning *
    )
    insert into public.order_items(
        id,
        order_id,
        product_id,
        variant_id,
        price_amount,
        quantity)
    select
        line_item_id,
        target_order_id,
        prod_id,
        var_id,
        price_amt,
        qty
    from
        item_data
    on conflict (id)
        do update set
            price_amount = excluded.price_amount,
            product_id = excluded.product_id,
            variant_id = excluded.variant_id,
            quantity = excluded.quantity;

    return new_order;

end;

$$ language plpgsql;

grant
execute on function public.upsert_order (
  uuid,
  varchar,
  text,
  public.payment_status,
  public.billing_provider,
  numeric,
  varchar,
  jsonb
) to service_role;

/**
 * -------------------------------------------------------
 * Section: Notifications
 * We create the schema for the notifications. Notifications are the notifications for an account.
 * -------------------------------------------------------
 */
create type public.notification_channel as enum('in_app', 'email');

create type public.notification_type as enum('info', 'warning', 'error');

create table if not exists
  public.notifications (
    id bigint generated always as identity primary key,
    account_id uuid not null references public.accounts (id) on delete cascade,
    type public.notification_type not null default 'info',
    body varchar(5000) not null,
    link varchar(255),
    channel public.notification_channel not null default 'in_app',
    dismissed boolean not null default false,
    expires_at timestamptz default (now() + interval '1 month'),
    created_at timestamptz not null default now()
  );

comment on table notifications is 'The notifications for an account';

comment on column notifications.account_id is 'The account the notification is for (null for system messages)';

comment on column notifications.type is 'The type of the notification';

comment on column notifications.body is 'The body of the notification';

comment on column notifications.link is 'The link for the notification';

comment on column notifications.channel is 'The channel for the notification';

comment on column notifications.dismissed is 'Whether the notification has been dismissed';

comment on column notifications.expires_at is 'The expiry date for the notification';

comment on column notifications.created_at is 'The creation date for the notification';

-- Revoke all access to notifications table for authenticated users and service_role
revoke all on public.notifications
from
  authenticated,
  service_role;

-- Open up relevant access to notifications table for authenticated users and service_role
grant
select
,
update on table public.notifications to authenticated,
service_role;

grant insert on table public.notifications to service_role;

-- enable realtime
alter publication supabase_realtime
add table public.notifications;

-- Indexes
-- Indexes on the notifications table
-- index for selecting notifications for an account that are not dismissed and not expired
create index idx_notifications_account_dismissed on notifications (account_id, dismissed, expires_at);

-- RLS
alter table public.notifications enable row level security;

-- SELECT(notifications):
-- Users can read notifications on an account they are a member of
create policy notifications_read_self on public.notifications for
select
  to authenticated using (
    account_id = (
      select
        auth.uid ()
    )
    or has_role_on_account (account_id)
  );

-- UPDATE(notifications):
-- Users can set notifications to read on an account they are a member of
create policy notifications_update_self on public.notifications
for update
  to authenticated using (
    account_id = (
      select
        auth.uid ()
    )
    or has_role_on_account (account_id)
  );

-- Function "kit.update_notification_dismissed_status"
-- Make sure the only updatable field is the dismissed status and nothing else
create
or replace function kit.update_notification_dismissed_status () returns trigger
set
  search_path to '' as $$
begin
    old.dismissed := new.dismissed;

    if (new is distinct from old) then
         raise exception 'UPDATE of columns other than "dismissed" is forbidden';
    end if;

    return old;
end;
$$ language plpgsql;

-- add trigger when updating a notification to update the dismissed status
create trigger update_notification_dismissed_status before
update on public.notifications for each row
execute procedure kit.update_notification_dismissed_status ();

/**
 * -------------------------------------------------------
 * Section: Slugify
 * We create the schema for the slugify functions. Slugify functions are used to create slugs from strings.
 * We use this for ensure unique slugs for accounts.
 * -------------------------------------------------------
 */
-- Create a function to slugify a string
-- useful for turning an account name into a unique slug
create
or replace function kit.slugify ("value" text) returns text as $$
    -- removes accents (diacritic signs) from a given string --
    with "unaccented" as(
        select
            kit.unaccent("value") as "value"
),
-- lowercases the string
"lowercase" as(
    select
        lower("value") as "value"
    from
        "unaccented"
),
-- remove single and double quotes
"removed_quotes" as(
    select
	regexp_replace("value", '[''"]+', '',
	    'gi') as "value"
    from
        "lowercase"
),
-- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
"hyphenated" as(
    select
	regexp_replace("value", '[^a-z0-9\\-_]+', '-',
	    'gi') as "value"
    from
        "removed_quotes"
),
-- trims hyphens('-') if they exist on the head or tail of
--   the string
"trimmed" as(
    select
	regexp_replace(regexp_replace("value", '\-+$',
	    ''), '^\-', '') as "value" from "hyphenated"
)
        select
            "value"
        from
            "trimmed";
$$ language SQL strict immutable
set
  search_path to '';

grant
execute on function kit.slugify (text) to service_role,
authenticated;

-- Function "kit.set_slug_from_account_name"
-- Set the slug from the account name and increment if the slug exists
create
or replace function kit.set_slug_from_account_name () returns trigger language plpgsql security definer
set
  search_path = '' as $$
declare
    sql_string varchar;
    tmp_slug varchar;
    increment integer;
    tmp_row record;
    tmp_row_count integer;
begin
    tmp_row_count = 1;

    increment = 0;

    while tmp_row_count > 0 loop
        if increment > 0 then
            tmp_slug = kit.slugify(new.name || ' ' || increment::varchar);

        else
            tmp_slug = kit.slugify(new.name);

        end if;

	sql_string = format('select count(1) cnt from public.accounts where slug = ''' || tmp_slug ||
	    '''; ');

        for tmp_row in execute (sql_string)
            loop
                raise notice 'tmp_row %', tmp_row;

                tmp_row_count = tmp_row.cnt;

            end loop;

        increment = increment +1;

    end loop;

    new.slug := tmp_slug;

    return NEW;

end
$$;

-- Create a trigger to set the slug from the account name
create trigger "set_slug_from_account_name" before insert on public.accounts for each row when (
  NEW.name is not null
  and NEW.slug is null
  and NEW.is_personal_account = false
)
execute procedure kit.set_slug_from_account_name ();

-- Create a trigger when a name is updated to update the slug
create trigger "update_slug_from_account_name" before
update on public.accounts for each row when (
  NEW.name is not null
  and NEW.name <> OLD.name
  and NEW.is_personal_account = false
)
execute procedure kit.set_slug_from_account_name ();

-- Function "kit.setup_new_user"
-- Setup a new user account after user creation
create
or replace function kit.setup_new_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
declare
    user_name text;
begin
    if new.raw_user_meta_data ->> 'display_name' is not null then
        user_name := new.raw_user_meta_data ->> 'display_name';

    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);

    end if;

    if user_name is null then
        user_name := '';

    end if;

    insert into public.accounts(
        id,
        primary_owner_user_id,
        name,
        is_personal_account,
        email)
    values (
        new.id,
        new.id,
        user_name,
        true,
        new.email);

    return new;

end;

$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure kit.setup_new_user ();

/**
 * -------------------------------------------------------
 * Section: Functions
 * We create the schema for the functions. Functions are the custom functions for the application.
 * -------------------------------------------------------
 */
-- Function "public.create_team_account"
-- Create a team account if team accounts are enabled
create
or replace function public.create_team_account (account_name text) returns public.accounts
set
  search_path = '' as $$
declare
    new_account public.accounts;
begin
    if (not public.is_set('enable_team_accounts')) then
        raise exception 'Team accounts are not enabled';
    end if;

    insert into public.accounts(
        name,
        is_personal_account)
    values (
        account_name,
        false)
returning
    * into new_account;

    return new_account;

end;

$$ language plpgsql;

grant
execute on function public.create_team_account (text) to authenticated,
service_role;

-- RLS(public.accounts)
-- Authenticated users can create team accounts
create policy create_org_account on public.accounts for insert to authenticated
with
  check (
    public.is_set ('enable_team_accounts')
    and public.accounts.is_personal_account = false
  );

-- Function "public.create_invitation"
-- create an invitation to an account
create
or replace function public.create_invitation (account_id uuid, email text, role varchar(50)) returns public.invitations
set
  search_path = '' as $$
declare
    new_invitation public.invitations;
    invite_token text;
begin
    invite_token := extensions.uuid_generate_v4();

    insert into public.invitations(
        email,
        account_id,
        invited_by,
        role,
        invite_token)
    values (
        email,
        account_id,
        auth.uid(),
        role,
        invite_token)
returning
    * into new_invitation;

    return new_invitation;

end;

$$ language plpgsql;

--
-- VIEW "user_account_workspace":
-- we create a view to load the general app data for the authenticated
-- user which includes the user accounts and memberships
create or replace view
  public.user_account_workspace
with
  (security_invoker = true) as
select
  accounts.id as id,
  accounts.name as name,
  accounts.picture_url as picture_url,
  (
    select
      status
    from
      public.subscriptions
    where
      account_id = accounts.id
    limit
      1
  ) as subscription_status
from
  public.accounts
where
  primary_owner_user_id = (select auth.uid ())
  and accounts.is_personal_account = true
limit
  1;

grant
select
  on public.user_account_workspace to authenticated,
  service_role;

--
-- VIEW "user_accounts":
-- we create a view to load the user's accounts and memberships
-- useful to display the user's accounts in the app
create or replace view
  public.user_accounts (id, name, picture_url, slug, role)
with
  (security_invoker = true) as
select
  account.id,
  account.name,
  account.picture_url,
  account.slug,
  membership.account_role
from
  public.accounts account
  join public.accounts_memberships membership on account.id = membership.account_id
where
  membership.user_id = (select auth.uid ())
  and account.is_personal_account = false
  and account.id in (
    select
      account_id
    from
      public.accounts_memberships
    where
      user_id = (select auth.uid ())
  );

grant
select
  on public.user_accounts to authenticated,
  service_role;

--
-- Function "public.team_account_workspace"
-- Load all the data for a team account workspace
create or replace function public.team_account_workspace(account_slug text)
returns table (
  id uuid,
  name varchar(255),
  picture_url varchar(1000),
  slug text,
  role varchar(50),
  role_hierarchy_level int,
  primary_owner_user_id uuid,
  subscription_status public.subscription_status,
  permissions public.app_permissions[]
)
set search_path to ''
as $$
begin
    return QUERY
    select
        accounts.id,
        accounts.name,
        accounts.picture_url,
        accounts.slug,
        accounts_memberships.account_role,
        roles.hierarchy_level,
        accounts.primary_owner_user_id,
        subscriptions.status,
        array_agg(role_permissions.permission)
    from
        public.accounts
        join public.accounts_memberships on accounts.id = accounts_memberships.account_id
        left join public.subscriptions on accounts.id = subscriptions.account_id
        join public.roles on accounts_memberships.account_role = roles.name
        left join public.role_permissions on accounts_memberships.account_role = role_permissions.role
    where
        accounts.slug = account_slug
        and public.accounts_memberships.user_id = (select auth.uid())
    group by
        accounts.id,
        accounts_memberships.account_role,
        subscriptions.status,
        roles.hierarchy_level;
end;
$$ language plpgsql;

grant
execute on function public.team_account_workspace (text) to authenticated,
service_role;

-- Functions "public.get_account_members"
-- Function to get the members of an account by the account slug
create
or replace function public.get_account_members (account_slug text) returns table (
  id uuid,
  user_id uuid,
  account_id uuid,
  role varchar(50),
  role_hierarchy_level int,
  primary_owner_user_id uuid,
  name varchar,
  email varchar,
  picture_url varchar,
  created_at timestamptz,
  updated_at timestamptz
) language plpgsql
set
  search_path = '' as $$
begin
    return QUERY
    select
        acc.id,
        am.user_id,
        am.account_id,
        am.account_role,
        r.hierarchy_level,
        a.primary_owner_user_id,
        acc.name,
        acc.email,
        acc.picture_url,
        am.created_at,
        am.updated_at
    from
        public.accounts_memberships am
        join public.accounts a on a.id = am.account_id
        join public.accounts acc on acc.id = am.user_id
        join public.roles r on r.name = am.account_role
    where
        a.slug = account_slug;

end;

$$;

grant
execute on function public.get_account_members (text) to authenticated,
service_role;

-- Function "public.get_account_invitations"
-- List the account invitations by the account slug
create
or replace function public.get_account_invitations (account_slug text) returns table (
  id integer,
  email varchar(255),
  account_id uuid,
  invited_by uuid,
  role varchar(50),
  created_at timestamptz,
  updated_at timestamptz,
  expires_at timestamptz,
  inviter_name varchar,
  inviter_email varchar
)
set
  search_path = '' as $$
begin
    return query
    select
        invitation.id,
        invitation.email,
        invitation.account_id,
        invitation.invited_by,
        invitation.role,
        invitation.created_at,
        invitation.updated_at,
        invitation.expires_at,
        account.name,
        account.email
    from
        public.invitations as invitation
        join public.accounts as account on invitation.account_id = account.id
    where
        account.slug = account_slug;

end;

$$ language plpgsql;

grant
execute on function public.get_account_invitations (text) to authenticated,
service_role;

-- Function "public.add_invitations_to_account"
-- Add invitations to an account
create
or replace function public.add_invitations_to_account (
  account_slug text,
  invitations public.invitation[]
) returns public.invitations[]
set
  search_path = '' as $$
declare
    new_invitation public.invitations;
    all_invitations public.invitations[] := array[]::public.invitations[];
    invite_token text;
    email text;
    role varchar(50);
begin
    FOREACH email,
    role in array invitations loop
        invite_token := extensions.uuid_generate_v4();

        insert into public.invitations(
            email,
            account_id,
            invited_by,
            role,
            invite_token)
        values (
            email,
(
                select
                    id
                from
                    public.accounts
                where
                    slug = account_slug), auth.uid(), role, invite_token)
    returning
        * into new_invitation;

        all_invitations := array_append(all_invitations, new_invitation);

    end loop;

    return all_invitations;

end;

$$ language plpgsql;

grant
execute on function public.add_invitations_to_account (text, public.invitation[]) to authenticated,
service_role;

-- Function "public.has_active_subscription"
-- Check if a user has an active subscription on an account - ie. it's trialing or active
-- Useful to gate access to features that require a subscription
create
or replace function public.has_active_subscription (target_account_id uuid) returns boolean
set
  search_path = '' as $$
begin
    return exists (
        select
            1
        from
            public.subscriptions
        where
            account_id = target_account_id
            and active = true);

end;

$$ language plpgsql;

grant
execute on function public.has_active_subscription (uuid) to authenticated,
service_role;

-- Storage
-- Account Image
insert into
  storage.buckets (id, name, PUBLIC)
values
  ('account_image', 'account_image', true);

-- Function: get the storage filename as a UUID.
-- Useful if you want to name files with UUIDs related to an account
create
or replace function kit.get_storage_filename_as_uuid (name text) returns uuid
set
  search_path = '' as $$
begin
    return replace(storage.filename(name), concat('.',
	storage.extension(name)), '')::uuid;

end;

$$ language plpgsql;

grant
execute on function kit.get_storage_filename_as_uuid (text) to authenticated,
service_role;

-- RLS policies for storage
create policy account_image on storage.objects for all using (
  bucket_id = 'account_image'
  and kit.get_storage_filename_as_uuid (name) = (
    select
      auth.uid ()
  )
  or public.has_role_on_account (kit.get_storage_filename_as_uuid (name))
)
with
  check (
    bucket_id = 'account_image'
    and (kit.get_storage_filename_as_uuid (name) = (
      select
        auth.uid ()
    )
    or public.has_permission (
      auth.uid (),
      kit.get_storage_filename_as_uuid (name),
      'settings.manage'
    ))
  );
