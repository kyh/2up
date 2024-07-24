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
  "anon",
  "authenticated";

-- we allow the authenticated role to execute functions in the public schema
grant usage on schema public to "authenticated";

-- we allow the service_role role to execute functions in the public schema
grant usage on schema public to "service_role";

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
create type public."AppPermissions" as enum(
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
create type public."SubscriptionStatus" as ENUM(
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
create type public."PaymentStatus" as ENUM('pending', 'succeeded', 'failed');

/*
* Billing Provider
- We create the billing provider for the Supabase Init. These providers are used to manage the billing provider for the accounts
- The providers are 'stripe', 'lemon-squeezy', and 'paddle'.
- You can add more providers as needed.
*/
create type public."BillingProvider" as ENUM('stripe', 'lemon-squeezy', 'paddle');

/*
* Subscription Item Type
- We create the subscription item type for the Supabase Init. These types are used to manage the type of the subscription items
- The types are 'flat', 'per_seat', and 'metered'.
- You can add more types as needed.
*/
create type public."SubscriptionItemType" as ENUM('flat', 'per_seat', 'metered');

/*
* Invitation Type
- We create the invitation type for the Supabase Init. These types are used to manage the type of the invitation
*/
create type public."Invitation" as (email text, role varchar(50));

/*
 * -------------------------------------------------------
 * Section: App Configuration
 * We create the configuration for the Supabase Init to enable or disable features
 * -------------------------------------------------------
 */
create table if not exists
  public."Config" (
    "enableTeamAccounts" boolean default true not null,
    "enableAccountBilling" boolean default true not null,
    "enableTeamAccountBilling" boolean default true not null,
    "billingProvider" public."BillingProvider" default 'stripe' not null
  );

comment on table public."Config" is 'Configuration for the Supabase Init.';

comment on column public."Config"."enableTeamAccounts" is 'Enable team accounts';

comment on column public."Config"."enableAccountBilling" is 'Enable billing for individual accounts';

comment on column public."Config"."enableTeamAccountBilling" is 'Enable billing for team accounts';

comment on column public."Config"."billingProvider" is 'The billing provider to use';

-- RLS(Config)
alter table public."Config" enable row level security;

-- create Config row
insert into
  public."Config" (
    "enableTeamAccounts",
    "enableAccountBilling",
    "enableTeamAccountBilling"
  )
values
  (true, true, true);

-- Revoke all on accounts table from authenticated and service_role
revoke all on public."Config"
from
  "authenticated",
  "service_role";

-- Open up access to Config table for authenticated users and service_role
grant
select
  on public."Config" to "authenticated",
  "service_role";

-- RLS
-- SELECT(Config):
-- Authenticated users can read the Config
create policy "public Config can be read by authenticated users" on public."Config" for
select
  to "authenticated" using (true);

-- Function to get the Config settings
create
or replace function public."get_config" () returns json
set
  search_path = '' as $$
declare
    result record;
begin
    select
        *
    from
        public."Config"
    limit 1 into result;

    return row_to_json(result);

end;

$$ language plpgsql;

-- Automatically set timestamps on tables when a row is inserted or updated
create
or replace function public."trigger_set_timestamps" () returns trigger
set
  search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        new."createdAt" = now();

        new."updatedAt" = now();

    else
        new."updatedAt" = now();

        new."createdAt" = old."createdAt";

    end if;

    return NEW;

end
$$ language plpgsql;

-- Automatically set user tracking on tables when a row is inserted or updated
create
or replace function public."trigger_set_user_tracking" () returns trigger
set
  search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        new."createdBy" = auth.uid();
        new."updatedBy" = auth.uid();

    else
        new."updatedBy" = auth.uid();

        new."createdBy" = old."createdBy";

    end if;

    return NEW;

end
$$ language plpgsql;

grant
execute on function public."get_config" () to "authenticated",
"service_role";

-- Function "public.is_set"
-- Check if a field is set in the Config
create
or replace function public."is_set" (fieldName text) returns boolean
set
  search_path = '' as $$
declare
    result boolean;
begin
    execute format('select %I from public."Config" limit 1', fieldName) into result;

    return result;

end;

$$ language plpgsql;

grant
execute on function public."is_set" (text) to "authenticated";

/*
 * -------------------------------------------------------
 * Section: Accounts
 * We create the schema for the accounts. Accounts are the top level entity in the Supabase Init. They can be team or personal accounts.
 * -------------------------------------------------------
 */
-- Accounts table
create table if not exists
  public."Accounts" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),
    "primaryOwnerUserId" uuid references auth.users on delete cascade not null default auth.uid (),
    "name" varchar(255) not null,
    "slug" text unique,
    "email" varchar(320) unique,
    "isPersonalAccount" boolean default false not null,
    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "createdBy" uuid references auth.users,
    "updatedBy" uuid references auth.users,
    "pictureUrl" varchar(1000),
    "publicData" jsonb default '{}'::jsonb not null,
    primary key ("id")
  );

comment on table public."Accounts" is 'Accounts are the top level entity in the Supabase Init. They can be team or personal accounts.';

comment on column public."Accounts"."isPersonalAccount" is 'Whether the account is a personal account or not';

comment on column public."Accounts"."name" is 'The name of the account';

comment on column public."Accounts"."slug" is 'The slug of the account';

comment on column public."Accounts"."primaryOwnerUserId" is 'The primary owner of the account';

comment on column public."Accounts"."email" is 'The email of the account. For teams, this is the email of the team (if any)';

-- Enable RLS on the Accounts table
alter table "public"."Accounts" enable row level security;

-- Revoke all on Accounts table from authenticated and service_role
revoke all on public."Accounts"
from
  "authenticated",
  "service_role";

-- Open up access to Accounts
grant
select,
  insert,
update,
delete on table public."Accounts" to "authenticated",
"service_role";

-- constraint that conditionally allows nulls on the slug ONLY if
--  personal_account is true
alter table public."Accounts"
add constraint "accounts_slug_null_if_personal_account_true" check (
  (
    "isPersonalAccount" = true
    and "slug" is null
  )
  or (
    "isPersonalAccount" = false
    and "slug" is not null
  )
);

-- Indexes
create index if not exists ix_accounts_primary_owner_user_id on public."Accounts" ("primaryOwnerUserId");

create index if not exists ix_accounts_is_personal_account on public."Accounts" ("isPersonalAccount");

-- constraint to ensure that the primaryOwnerUserId is unique for personal accounts
create unique index unique_personal_account on public."Accounts" ("primaryOwnerUserId")
where
  "isPersonalAccount" = true;

-- RLS on the Accounts table
-- UPDATE(Accounts):
-- Team owners can update their accounts
create policy accounts_self_update on public."Accounts"
for update
  to "authenticated" using (
    (
      select
        auth.uid ()
    ) = "primaryOwnerUserId"
  )
with
  check (
    (
      select
        auth.uid ()
    ) = "primaryOwnerUserId"
  );

-- Function "public.transfer_team_account_ownership"
-- Function to transfer the ownership of a team account to another user
create
or replace function public."transfer_team_account_ownership" ("targetAccountId" uuid, "newOwnerId" uuid) returns void
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
            public."AccountsMemberships"
        where
            "targetAccountId" = "accountId"
            and "userId" = "newOwnerId") then
        raise exception 'The new owner must be a member of the account';
    end if;

    -- update the primary owner of the account
    update
        public."Accounts"
    set
        "primaryOwnerUserId" = "newOwnerId"
    where
        id = "targetAccountId"
        and "isPersonalAccount" = false;

    -- update membership assigning it the hierarchy role
    update
        public."AccountsMemberships"
    set
        "accountRole" =(
            public."get_upper_system_role"())
    where
        "targetAccountId" = "accountId"
        and "userId" = "newOwnerId"
        and "accountRole" <>(
            public."get_upper_system_role"());

end;

$$ language plpgsql;

grant
execute on function public."transfer_team_account_ownership" (uuid, uuid) to "service_role";

-- Function "public.is_account_owner"
-- Function to check if a user is the primary owner of an account
create
or replace function public."is_account_owner" ("accountId" uuid) returns boolean
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public."Accounts"
            where
                id = "is_account_owner"."accountId"
                and "primaryOwnerUserId" = auth.uid());
$$ language sql;

grant
execute on function public."is_account_owner" (uuid) to "authenticated",
"service_role";

-- Function "kit.protect_account_fields"
-- Function to protect account fields from being updated
create
or replace function kit."protect_account_fields" () returns trigger as $$
begin
    if current_user in('authenticated', 'anon') then
	if new.id <> old.id or new."isPersonalAccount" <>
	    old."isPersonalAccount" or new."primaryOwnerUserId" <>
	    old."primaryOwnerUserId" or new.email <> old.email then
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
update on public."Accounts" for each row
execute function kit."protect_account_fields" ();

-- Function "public.get_upper_system_role"
-- Function to get the highest system role for an account
create
or replace function public."get_upper_system_role" () returns varchar
set
  search_path = '' as $$
declare
    role varchar(50);
begin
    select name from public."Roles"
      where "hierarchyLevel" = 1 into role;

    return role;
end;
$$ language plpgsql;

grant
execute on function public."get_upper_system_role" () to "service_role";

-- Function "kit.add_current_user_to_new_account"
-- Trigger to add the current user to a new account as the primary owner
create
or replace function kit."add_current_user_to_new_account" () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    if new."primaryOwnerUserId" = auth.uid() then
        insert into public."AccountsMemberships"(
            "accountId",
            "userId",
            "accountRole")
        values(
            new.id,
            auth.uid(),
            public."get_upper_system_role"());

    end if;

    return NEW;

end;

$$;

-- trigger the function whenever a new account is created
create trigger "add_current_user_to_new_account"
after insert on public."Accounts" for each row
when (new."isPersonalAccount" = false)
execute function kit."add_current_user_to_new_account" ();

-- create a trigger to update the account email when the primary owner email is updated
create
or replace function kit."handle_update_user_email" () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    update
        public."Accounts"
    set
        email = new.email
    where
        "primaryOwnerUserId" = new.id
        and "isPersonalAccount" = true;

    return new;

end;

$$;

-- trigger the function every time a user email is updated only if the user is the primary owner of the account and
-- the account is personal account
create trigger "on_auth_user_updated"
after
update of email on auth.users for each row
execute procedure kit."handle_update_user_email" ();

/*
 * -------------------------------------------------------
 * Section: Roles
 * We create the schema for the roles. Roles are the roles for an account. For example, an account might have the roles 'owner', 'admin', and 'member'.
 * -------------------------------------------------------
 */
-- Roles Table
create table if not exists
  public."Roles" (
    name varchar(50) not null,
    "hierarchyLevel" int not null check ("hierarchyLevel" > 0),
    primary key (name),
    unique ("hierarchyLevel")
  );

-- Revoke all on roles table from authenticated and service_role
revoke all on public."Roles"
from
  "authenticated",
  "service_role";

-- Open up access to roles table for authenticated users and service_role
grant
select
on table public."Roles" to "authenticated",
"service_role";

-- RLS
alter table public."Roles" enable row level security;

/*
 * -------------------------------------------------------
 * Section: Memberships
 * We create the schema for the memberships. Memberships are the memberships for an account. For example, a user might be a member of an account with the role 'owner'.
 * -------------------------------------------------------
 */
-- Account Memberships table
create table if not exists
  public."AccountsMemberships" (
    "userId" uuid references auth.users on delete cascade not null,
    "accountId" uuid references public."Accounts" (id) on delete cascade not null,
    "accountRole" varchar(50) references public."Roles" (name) not null,
    "createdAt" timestamptz default current_timestamp not null,
    "updatedAt" timestamptz default current_timestamp not null,
    "createdBy" uuid references auth.users,
    "updatedBy" uuid references auth.users,
    primary key ("userId", "accountId")
  );

comment on table public."AccountsMemberships" is 'The memberships for an account';

comment on column public."AccountsMemberships"."accountId" is 'The account the membership is for';

comment on column public."AccountsMemberships"."accountRole" is 'The role for the membership';

-- Revoke all on AccountsMemberships table from authenticated and service_role
revoke all on public."AccountsMemberships"
from
  "authenticated",
  "service_role";

-- Open up access to AccountsMemberships table for authenticated users and service_role
grant
select,
  insert,
update,
delete on table public."AccountsMemberships" to "authenticated",
"service_role";

-- Indexes on the AccountsMemberships table
create index ix_accounts_memberships_account_id on public."AccountsMemberships" ("accountId");

create index ix_accounts_memberships_user_id on public."AccountsMemberships" ("userId");

create index ix_accounts_memberships_accountRole on public."AccountsMemberships" ("accountRole");

-- Enable RLS on the AccountsMemberships table
alter table public."AccountsMemberships" enable row level security;

-- Function "kit.prevent_account_owner_membership_delete"
-- Trigger to prevent a primary owner from being removed from an account
create
or replace function kit."prevent_account_owner_membership_delete" () returns trigger
set
  search_path = '' as $$
begin
    if exists(
        select
            1
        from
            public."Accounts"
        where
            id = old."accountId"
            and "primaryOwnerUserId" = old."userId") then
    raise exception 'The primary account owner cannot be removed from the account membership list';

end if;

    return old;

end;

$$ language plpgsql;

create
or replace trigger prevent_account_owner_membership_delete_check before delete on public."AccountsMemberships" for each row
execute function kit."prevent_account_owner_membership_delete" ();

-- Function "kit.prevent_memberships_update"
-- Trigger to prevent updates to account memberships with the exception of the accountRole
create
or replace function kit."prevent_memberships_update" () returns trigger
set
  search_path = '' as $$
begin
    if new."accountRole" <> old."accountRole" then
        return new;
    end if;

    raise exception 'Only the accountRole can be updated';

end; $$ language plpgsql;

create
or replace trigger prevent_memberships_update_check before
update on public."AccountsMemberships" for each row
execute function kit."prevent_memberships_update" ();

-- Function "public.has_role_on_account"
-- Function to check if a user has a role on an account
create
or replace function public."has_role_on_account" (
  "accountId" uuid,
  "accountRole" varchar(50) default null
) returns boolean language sql security definer
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public."AccountsMemberships" membership
            where
                membership."userId" = (select auth.uid())
                and membership."accountId" = "has_role_on_account"."accountId"
                and((membership."accountRole" = "has_role_on_account"."accountRole"
                    or "has_role_on_account"."accountRole" is null)));
$$;

grant
execute on function public."has_role_on_account" (uuid, varchar) to "authenticated";

-- Function "public.is_team_member"
-- Check if a user is a team member of an account or not
create
or replace function public."is_team_member" ("accountId" uuid, "userId" uuid) returns boolean language sql security definer
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public."AccountsMemberships" membership
            where
                public."has_role_on_account"("accountId")
                and membership."userId" = "is_team_member"."userId"
                and membership."accountId" = "is_team_member"."accountId");
$$;

grant
execute on function public."is_team_member" (uuid, uuid) to "authenticated",
"service_role";

-- RLS
-- SELECT(Roles)
-- authenticated users can query Roles
create policy roles_read on public."Roles" for
select
  to "authenticated" using (
    true
  );

-- Function "public.can_action_account_member"
-- Check if a user can perform management actions on an account member
create
or replace function public."can_action_account_member" ("targetTeamAccountId" uuid, "targetUserId" uuid) returns boolean
set
  search_path = '' as $$
declare
    "permissionGranted" boolean;
    "targetUserHierarchyLevel" int;
    "currentUserHierarchyLevel" int;
    "isAccountOwner" boolean;
    "targetUserRole" varchar(50);
begin
    if "targetUserId" = auth.uid() then
      raise exception 'You cannot update your own account membership with this function';
    end if;

    -- an account owner can action any member of the account
    if public."is_account_owner"("targetTeamAccountId") then
      return true;
    end if;

     -- check the target user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public."Accounts"
            where
                id = "targetTeamAccountId"
                and "primaryOwnerUserId" = "targetUserId") into "isAccountOwner";

    if "isAccountOwner" then
        raise exception 'The primary account owner cannot be actioned';
    end if;

    -- validate the auth user has the required permission on the account
    -- to manage members of the account
    select
 public."has_permission"(auth.uid(), "targetTeamAccountId",
     'members.manage'::public."AppPermissions") into
     "permissionGranted";

    -- if the user does not have the required permission, raise an exception
    if not "permissionGranted" then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    -- get the role of the target user
    select
        am."accountRole",
        r."hierarchyLevel"
    from
        public."AccountsMemberships" as am
    join
        public."Roles" as r on am."accountRole" = r.name
    where
        am."accountId" = "targetTeamAccountId"
        and am."userId" = "targetUserId"
    into "targetUserRole", "targetUserHierarchyLevel";

    -- get the hierarchy level of the current user
    select
        r."hierarchyLevel" into "currentUserHierarchyLevel"
    from
        public."Roles" as r
    join
        public."AccountsMemberships" as am on r.name = am."accountRole"
    where
        am."accountId" = "targetTeamAccountId"
        and am."userId" = auth.uid();

    if "targetUserRole" is null then
      raise exception 'The target user does not have a role on the account';
    end if;

    if "currentUserHierarchyLevel" is null then
      raise exception 'The current user does not have a role on the account';
    end if;

    -- check the current user has a higher role than the target user
    if "currentUserHierarchyLevel" >= "targetUserHierarchyLevel" then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    return true;

end;

$$ language plpgsql;

grant
execute on function public."can_action_account_member" (uuid, uuid) to "authenticated",
"service_role";

-- RLS
-- SELECT(AccountsMemberships):
-- Users can read their team members account memberships
create policy accounts_memberships_read on public."AccountsMemberships" for
select
  to "authenticated" using (
    (
      (
        select
          auth.uid ()
      ) = "userId"
    )
    or public."is_team_member" ("accountId", "userId")
  );

create
or replace function public."is_account_team_member" ("targetAccountId" uuid) returns boolean
set
  search_path = '' as $$
    select exists(
        select 1
        from public."AccountsMemberships" as membership
        where public."is_team_member" (membership."accountId", "targetAccountId")
    );
$$ language sql;

grant
execute on function public."is_account_team_member" (uuid) to "authenticated",
"service_role";

-- RLS on the Accounts table
-- SELECT(Accounts):
-- Users can read an account if
--   - they are the primary owner of the account
--   - they have a role on the account
--   - they are reading an account of the same team
create policy accounts_read on public."Accounts" for
select
  to "authenticated" using (
    (
      (
        select
          auth.uid ()
      ) = "primaryOwnerUserId"
    )
    or public."has_role_on_account" (id)
    or public."is_account_team_member" (id)
  );

-- DELETE(AccountsMemberships):
-- Users with the required role can remove members from an account or remove their own
create policy accounts_memberships_delete on public."AccountsMemberships" for delete to "authenticated" using (
  (
    "userId" = (
      select
        auth.uid ()
    )
  )
  or public."can_action_account_member" ("accountId", "userId")
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
  public."RolePermissions" (
    id bigint generated by default as identity primary key,
    role varchar(50) references public."Roles" (name) not null,
    permission public."AppPermissions" not null,
    unique (role, permission)
  );

comment on table public."RolePermissions" is 'The permissions for a role';

comment on column public."RolePermissions".role is 'The role the permission is for';

comment on column public."RolePermissions".permission is 'The permission for the role';

-- Indexes on the RolePermissions table
create index ix_role_permissions_role on public."RolePermissions" (role);

-- Revoke all on RolePermissions table from authenticated and service_role
revoke all on public."RolePermissions"
from
  "authenticated",
  "service_role";

-- Open up access to RolePermissions table for authenticated users and service_role
grant
select,
  insert,
update,
delete on table public."RolePermissions" to "service_role";

-- Authenticated users can read role permissions
grant
select
  on table public."RolePermissions" to "authenticated";

-- Function "public.has_permission"
-- Create a function to check if a user has a permission
create
or replace function public."has_permission" (
  "userId" uuid,
  "accountId" uuid,
  "permissionName" public."AppPermissions"
) returns boolean
set
  search_path = '' as $$
begin
    return exists(
        select
            1
        from
            public."AccountsMemberships"
	    join public."RolePermissions" on
		"AccountsMemberships"."accountRole" =
		"RolePermissions".role
        where
            "AccountsMemberships"."userId" = "has_permission"."userId"
            and "AccountsMemberships"."accountId" = "has_permission"."accountId"
            and "RolePermissions".permission = "has_permission"."permissionName");

end;

$$ language plpgsql;

grant
execute on function public."has_permission" (uuid, uuid, public."AppPermissions") to "authenticated",
"service_role";

-- Function "public.has_more_elevated_role"
-- Check if a user has a more elevated role than the target role
create
or replace function public."has_more_elevated_role" (
  "targetUserId" uuid,
  "targetAccountId" uuid,
  "roleName" varchar
) returns boolean
set
  search_path = '' as $$
declare
    "isPrimaryOwner" boolean;
    "userRoleHierarchyLevel" int;
    "targetRoleHierarchyLevel" int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public."Accounts"
            where
                id = "targetAccountId"
                and "primaryOwnerUserId" = "targetUserId") into "isPrimaryOwner";

    -- If the user is the primary owner, they have the highest role and can
    --   perform any action
    if "isPrimaryOwner" then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        "hierarchyLevel" into "userRoleHierarchyLevel"
    from
        public."Roles"
    where
        name =(
            select
                "accountRole"
            from
                public."AccountsMemberships"
            where
                "accountId" = "targetAccountId"
                and "targetUserId" = "userId");

    if "userRoleHierarchyLevel" is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        "hierarchyLevel" into "targetRoleHierarchyLevel"
    from
        public."Roles"
    where
        name = "roleName";

    -- If the target role does not exist, the user cannot perform the action
    if "targetRoleHierarchyLevel" is null then
        return false;
    end if;

    -- If the user's role is higher than the target role, they can perform
    --   the action
    return "userRoleHierarchyLevel" < "targetRoleHierarchyLevel";

end;

$$ language plpgsql;

grant
execute on function public."has_more_elevated_role" (uuid, uuid, varchar) to "authenticated",
"service_role";

-- Function "public.has_same_role_hierarchyLevel"
-- Check if a user has the same role hierarchy level as the target role
create
or replace function public."has_same_role_hierarchyLevel" (
  "targetUserId" uuid,
  "targetAccountId" uuid,
  "roleName" varchar
) returns boolean
set
  search_path = '' as $$
declare
    "isPrimaryOwner" boolean;
    "userRoleHierarchyLevel" int;
    "targetRoleHierarchyLevel" int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public."Accounts"
            where
                id = "targetAccountId"
                and "primaryOwnerUserId" = "targetUserId") into "isPrimaryOwner";

    -- If the user is the primary owner, they have the highest role and can perform any action
    if "isPrimaryOwner" then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        "hierarchyLevel" into "userRoleHierarchyLevel"
    from
        public."Roles"
    where
        name =(
            select
                "accountRole"
            from
                public."AccountsMemberships"
            where
                "accountId" = "targetAccountId"
                and "targetUserId" = "userId");

    -- If the user does not have a role in the account, they cannot perform the action
    if "userRoleHierarchyLevel" is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        "hierarchyLevel" into "targetRoleHierarchyLevel"
    from
        public."Roles"
    where
        name = "roleName";

    -- If the target role does not exist, the user cannot perform the action
    if "targetRoleHierarchyLevel" is null then
        return false;
    end if;

   -- check the user's role hierarchy level is the same as the target role
    return "userRoleHierarchyLevel" = "targetRoleHierarchyLevel";

end;

$$ language plpgsql;

grant
execute on function public."has_same_role_hierarchyLevel" (uuid, uuid, varchar) to "authenticated",
"service_role";

-- Enable RLS on the RolePermissions table
alter table public."RolePermissions" enable row level security;

-- RLS on the RolePermissions table
-- SELECT(RolePermissions):
-- Authenticated Users can read global permissions
create policy role_permissions_read on public."RolePermissions" for
select
  to "authenticated" using (true);

/*
 * -------------------------------------------------------
 * Section: Invitations
 * We create the schema for the invitations. Invitations are the invitations for an account sent to a user to join the account.
 * -------------------------------------------------------
 */
create table if not exists
  public."Invitations" (
    id serial primary key,
    email varchar(255) not null,
    "accountId" uuid references public."Accounts" (id) on delete cascade not null,
    "invitedBy" uuid references auth.users on delete cascade not null,
    role varchar(50) references public."Roles" (name) not null,
    "inviteToken" varchar(255) unique not null,
    "createdAt" timestamptz default current_timestamp not null,
    "updatedAt" timestamptz default current_timestamp not null,
    "expiresAt" timestamptz default current_timestamp + interval '7 days' not null,
    unique (email, "accountId")
  );

comment on table public."Invitations" is 'The invitations for an account';

comment on column public."Invitations"."accountId" is 'The account the invitation is for';

comment on column public."Invitations"."invitedBy" is 'The user who invited the user';

comment on column public."Invitations".role is 'The role for the invitation';

comment on column public."Invitations"."inviteToken" is 'The token for the invitation';

comment on column public."Invitations"."expiresAt" is 'The expiry date for the invitation';

comment on column public."Invitations".email is 'The email of the user being invited';

-- Indexes on the Invitations table
create index ix_invitations_account_id on public."Invitations" ("accountId");

-- Revoke all on Invitations table from authenticated and service_role
revoke all on public."Invitations"
from
  "authenticated",
  "service_role";

-- Open up access to Invitations table for authenticated users and service_role
grant
select,
  insert,
update,
delete on table public."Invitations" to "authenticated",
"service_role";

-- Enable RLS on the Invitations table
alter table public."Invitations" enable row level security;

-- Function "kit.check_team_account"
-- Function to check if the account is a team account or not when inserting or updating an invitation
create
or replace function kit."check_team_account" () returns trigger
set
  search_path = '' as $$
begin
    if(
        select
            "isPersonalAccount"
        from
            public."Accounts"
        where
            id = new."accountId") then
        raise exception 'Account must be a team account';

    end if;

    return NEW;

end;

$$ language plpgsql;

create trigger only_team_accounts_check before insert
or
update on public."Invitations" for each row
execute procedure kit."check_team_account" ();

-- RLS on the Invitations table
-- SELECT(Invitations):
-- Users can read invitations to users of an account they are a member of
create policy invitations_read_self on public."Invitations" for
select
  to "authenticated" using (public."has_role_on_account" ("accountId"));

-- INSERT(Invitations):
-- Users can create invitations to users of an account they are
-- a member of  and have the 'invites.manage' permission AND the target role is not higher than the user's role
create policy invitations_create_self on public."Invitations" for insert to "authenticated"
with
  check (
    public."is_set" ('enableTeamAccounts')
    and public."has_permission" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      'invites.manage'::public."AppPermissions"
    )
    and public."has_same_role_hierarchyLevel" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      role
    )
  );

-- UPDATE(Invitations):
-- Users can update invitations to users of an account they are a member of and have the 'invites.manage' permission AND
-- the target role is not higher than the user's role
create policy invitations_update on public."Invitations"
for update
  to "authenticated" using (
    public."has_permission" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      'invites.manage'::public."AppPermissions"
    )
    and public."has_more_elevated_role" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      role
    )
  )
with
  check (
    public."has_permission" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      'invites.manage'::public."AppPermissions"
    )
    and public."has_more_elevated_role" (
      (
        select
          auth.uid ()
      ),
      "accountId",
      role
    )
  );

-- DELETE(public.Invitations):
-- Users can delete invitations to users of an account they are a member of and have the 'invites.manage' permission
create policy invitations_delete on public."Invitations" for delete to "authenticated" using (
  public."has_role_on_account" ("accountId")
  and public."has_permission" (
    (
      select
        auth.uid ()
    ),
    "accountId",
    'invites.manage'::public."AppPermissions"
  )
);

-- Functions "public.accept_invitation"
-- Function to accept an invitation to an account
create
or replace function public."accept_invitation" ("token" text, "userId" uuid) returns uuid
set
  search_path = '' as $$
declare
    "targetAccountId" uuid;
    role varchar(50);
begin
    select
        "accountId",
        role into "targetAccountId",
        role
    from
        public."Invitations"
    where
        "inviteToken" = token
        and "expiresAt" > now();

    if not found then
        raise exception 'Invalid or expired invitation token';
    end if;

    insert into public."AccountsMemberships"(
        "userId",
        "accountId",
        "accountRole")
    values (
        "accept_invitation"."userId",
        "targetAccountId",
        role);

    delete from public."Invitations"
    where "inviteToken" = token;

    return "targetAccountId";
end;

$$ language plpgsql;

grant
execute on function public."accept_invitation" (text, uuid) to "service_role";

/*
 * -------------------------------------------------------
 * Section: Billing Customers
 * We create the schema for the billing customers. Billing customers are the customers for an account in the billing provider. For example, a user might have a customer in the billing provider with the customer ID 'cus_123'.
 * -------------------------------------------------------
 */
-- Account Subscriptions table
create table
  public."BillingCustomers" (
    "accountId" uuid references public."Accounts" (id) on delete cascade not null,
    id serial primary key,
    email text,
    provider public."BillingProvider" not null,
    "customerId" text not null,
    unique ("accountId", "customerId", provider)
  );

comment on table public."BillingCustomers" is 'The billing customers for an account';

comment on column public."BillingCustomers"."accountId" is 'The account the billing customer is for';

comment on column public."BillingCustomers".provider is 'The provider of the billing customer';

comment on column public."BillingCustomers"."customerId" is 'The customer ID for the billing customer';

comment on column public."BillingCustomers".email is 'The email of the billing customer';

-- Indexes on the BillingCustomers table
create index ix_billing_customers_account_id on public."BillingCustomers" ("accountId");

-- Revoke all on BillingCustomers table from authenticated and service_role
revoke all on public."BillingCustomers"
from
  "authenticated",
  "service_role";

-- Open up relevant access to BillingCustomers table for authenticated users and service_role
grant
select,
  insert,
update,
delete on table public."BillingCustomers" to "service_role";

-- Open up access to BillingCustomers table for authenticated users
grant
select
  on table public."BillingCustomers" to "authenticated",
  "service_role";

-- Enable RLS on BillingCustomers table
alter table public."BillingCustomers" enable row level security;

-- RLS on the BillingCustomers table
-- SELECT(BillingCustomers):
-- Users can read account subscriptions on an account they are a member of
create policy billing_customers_read_self on public."BillingCustomers" for
select
  to "authenticated" using (
    "accountId" = (
      select
        auth.uid ()
    )
    or public."has_role_on_account" ("accountId")
  );

/*
 * -------------------------------------------------------
 * Section: Subscriptions
 * We create the schema for the subscriptions. Subscriptions are the subscriptions for an account to a product. For example, a user might have a subscription to a product with the status 'active'.
 * -------------------------------------------------------
 */
-- Subscriptions table
create table if not exists
  public."Subscriptions" (
    id text not null primary key,
    "accountId" uuid references public."Accounts" (id) on delete cascade not null,
    "billingCustomerId" int references public."BillingCustomers" on delete cascade not null,
    status public."SubscriptionStatus" not null,
    active bool not null,
    "billingProvider" public."BillingProvider" not null,
    "cancelAtPeriodEnd" bool not null,
    currency varchar(3) not null,
    "createdAt" timestamptz not null default current_timestamp,
    "updatedAt" timestamptz not null default current_timestamp,
    "periodStartsAt" timestamptz not null,
    "periodEndsAt" timestamptz not null,
    "trialStartsAt" timestamptz,
    "trialEndsAt" timestamptz
  );

comment on table public."Subscriptions" is 'The subscriptions for an account';

comment on column public."Subscriptions"."accountId" is 'The account the subscription is for';

comment on column public."Subscriptions"."billingProvider" is 'The provider of the subscription';

comment on column public."Subscriptions"."cancelAtPeriodEnd" is 'Whether the subscription will be canceled at the end of the period';

comment on column public."Subscriptions".currency is 'The currency for the subscription';

comment on column public."Subscriptions".status is 'The status of the subscription';

comment on column public."Subscriptions"."periodStartsAt" is 'The start of the current period for the subscription';

comment on column public."Subscriptions"."periodEndsAt" is 'The end of the current period for the subscription';

comment on column public."Subscriptions"."trialStartsAt" is 'The start of the trial period for the subscription';

comment on column public."Subscriptions"."trialEndsAt" is 'The end of the trial period for the subscription';

comment on column public."Subscriptions".active is 'Whether the subscription is active';

comment on column public."Subscriptions"."billingCustomerId" is 'The billing customer ID for the subscription';

-- Revoke all on Subscriptions table from authenticated and service_role
revoke all on public."Subscriptions"
from
  "authenticated",
  "service_role";

-- Open up relevant access to Subscriptions table for authenticated users and service_role
grant
select,
  insert,
  update,
  delete on table public."Subscriptions" to "service_role";

grant
select on table public."Subscriptions" to "authenticated";

-- Indexes on the Subscriptions table
create index ix_subscriptions_account_id on public."Subscriptions" ("accountId");

-- Enable RLS on Subscriptions table
alter table public."Subscriptions" enable row level security;

-- RLS on the Subscriptions table
-- SELECT(Subscriptions):
-- Users can read account subscriptions on an account they are a member of
create policy subscriptions_read_self on public."Subscriptions" for
select
  to "authenticated" using (
    (
      public."has_role_on_account" ("accountId")
      and public."is_set" ('enableTeamAccountBilling')
    )
    or (
      "accountId" = (
        select
          auth.uid ()
      )
      and public."is_set" ('enableAccountBilling')
    )
  );

-- Function "public.upsert_subscription"
-- Insert or Update a subscription and its items in the database when receiving a webhook from the billing provider
create
or replace function public."upsert_subscription" (
  "targetAccountId" uuid,
  "targetCustomerId" varchar(255),
  "targetSubscriptionId" text,
  active bool,
  status public."SubscriptionStatus",
  "billingProvider" public."BillingProvider",
  "cancelAtPeriodEnd" bool,
  currency varchar(3),
  "periodStartsAt" timestamptz,
  "periodEndsAt" timestamptz,
  "lineItems" jsonb,
  "trialStartsAt" timestamptz default null,
  "trialEndsAt" timestamptz default null
) returns public."Subscriptions"
set
  search_path = '' as $$
declare
    new_subscription public."Subscriptions";
    new_billing_customer_id int;
begin
    insert into public."BillingCustomers"(
        "accountId",
        provider,
        "customerId")
    values (
        "targetAccountId",
        provider,
        "targetCustomerId")
on conflict (
    "accountId",
    provider,
    "customerId")
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public."Subscriptions"(
        "accountId",
        "billingCustomerId",
        id,
        active,
        status,
        "billingProvider",
        "cancelAtPeriodEnd",
        currency,
        "periodStartsAt",
        "periodEndsAt",
        "trialStartsAt",
        "trialEndsAt")
    values (
        "targetAccountId",
        new_billing_customer_id,
        "targetSubscriptionId",
        active,
        status,
        "billingProvider",
        "cancelAtPeriodEnd",
        currency,
        "periodStartsAt",
        "periodEndsAt",
        "trialStartsAt",
        "trialEndsAt")
on conflict (
    id)
    do update set
        active = excluded.active,
        status = excluded.status,
        "cancelAtPeriodEnd" = excluded."cancelAtPeriodEnd",
        currency = excluded.currency,
        "periodStartsAt" = excluded."periodStartsAt",
        "periodEndsAt" = excluded."periodEndsAt",
        "trialStartsAt" = excluded."trialStartsAt",
        "trialEndsAt" = excluded."trialEndsAt"
    returning
        * into new_subscription;

    -- Upsert subscription items and delete ones that are not in the "lineItems" array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as "line_item_id",
            (line_item ->> 'product_id')::varchar as "prod_id",
            (line_item ->> 'variant_id')::varchar as "var_id",
            (line_item ->> 'type')::public."SubscriptionItemType" as type,
            (line_item ->> 'price_amount')::numeric as "price_amt",
            (line_item ->> 'quantity')::integer as qty,
            (line_item ->> 'interval')::varchar as intv,
            (line_item ->> 'interval_count')::integer as "intv_count"
        from
            jsonb_array_elements("lineItems") as line_item
    ),
    "line_item_ids" as (
        select "line_item_id" from item_data
    ),
    deleted_items as (
        delete from
            public."SubscriptionItems"
        where
            public."SubscriptionItems"."subscriptionId" = new_subscription.id
            and public."SubscriptionItems".id not in (select "line_item_id" from "line_item_ids")
        returning *
    )
    insert into public."SubscriptionItems"(
        id,
        "subscriptionId",
        "productId",
        "variantId",
        type,
        "priceAmount",
        quantity,
        interval,
        "intervalCount")
    select
        "line_item_id",
        "targetSubscriptionId",
        "prod_id",
        "var_id",
        type,
        "price_amt",
        qty,
        intv,
        "intv_count"
    from
        item_data
    on conflict (id)
        do update set
            "productId" = excluded."productId",
            "variantId" = excluded."variantId",
            "priceAmount" = excluded."priceAmount",
            quantity = excluded.quantity,
            interval = excluded.interval,
            type = excluded.type,
            "intervalCount" = excluded."intervalCount";

    return new_subscription;

end;

$$ language plpgsql;

grant
execute on function public."upsert_subscription" (
  uuid,
  varchar,
  text,
  bool,
  public."SubscriptionStatus",
  public."BillingProvider",
  bool,
  varchar,
  timestamptz,
  timestamptz,
  jsonb,
  timestamptz,
  timestamptz
) to "service_role";

/* -------------------------------------------------------
* Section: Subscription Items
* We create the schema for the subscription items. Subscription items are the items in a subscription.
* For example, a subscription might have a subscription item with the product ID 'prod_123' and the variant ID 'var_123'.
* -------------------------------------------------------
*/
create table if not exists
  public."SubscriptionItems" (
    id varchar(255) not null primary key,
    "subscriptionId" text references public."Subscriptions" (id) on delete cascade not null,
    "productId" varchar(255) not null,
    "variantId" varchar(255) not null,
    type public."SubscriptionItemType" not null,
    "priceAmount" numeric,
    quantity integer not null default 1,
    interval varchar(255) not null,
    "intervalCount" integer not null check ("intervalCount" > 0),
    "createdAt" timestamptz not null default current_timestamp,
    "updatedAt" timestamptz not null default current_timestamp,
    unique ("subscriptionId", "productId", "variantId")
  );

comment on table public."SubscriptionItems" is 'The items in a subscription';

comment on column public."SubscriptionItems"."subscriptionId" is 'The subscription the item is for';

comment on column public."SubscriptionItems"."productId" is 'The product ID for the item';

comment on column public."SubscriptionItems"."variantId" is 'The variant ID for the item';

comment on column public."SubscriptionItems"."priceAmount" is 'The price amount for the item';

comment on column public."SubscriptionItems".quantity is 'The quantity of the item';

comment on column public."SubscriptionItems".interval is 'The interval for the item';

comment on column public."SubscriptionItems"."intervalCount" is 'The interval count for the item';

comment on column public."SubscriptionItems"."createdAt" is 'The creation date of the item';

comment on column public."SubscriptionItems"."updatedAt" is 'The last update date of the item';

-- Revoke all access to SubscriptionItems table for authenticated users and service_role
revoke all on public."SubscriptionItems"
from
  "authenticated",
  "service_role";

-- Open up relevant access to SubscriptionItems table for authenticated users and service_role
grant
select on table public."SubscriptionItems" to "authenticated",
  "service_role";

grant insert,
  update,
  delete on table public."SubscriptionItems" to "service_role";

-- Indexes
-- Indexes on the SubscriptionItems table
create index ix_subscription_items_subscription_id on public."SubscriptionItems" ("subscriptionId");

-- RLS
alter table public."SubscriptionItems" enable row level security;

-- SELECT(SubscriptionItems)
-- Users can read subscription items on a subscription they are a member of
create policy subscription_items_read_self on public."SubscriptionItems" for
select
  to "authenticated" using (
    exists (
      select
        1
      from
        public."Subscriptions"
      where
        id = "subscriptionId"
        and (
          "accountId" = (
            select
              auth.uid ()
          )
          or public."has_role_on_account" ("accountId")
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
  public."Orders" (
    id text not null primary key,
    "accountId" uuid references public."Accounts" (id) on delete cascade not null,
    "billingCustomerId" int references public."BillingCustomers" on delete cascade not null,
    status public."PaymentStatus" not null,
    "billingProvider" public."BillingProvider" not null,
    "totalAmount" numeric not null,
    currency varchar(3) not null,
    "createdAt" timestamptz not null default current_timestamp,
    "updatedAt" timestamptz not null default current_timestamp
  );

comment on table public."Orders" is 'The one-time orders for an account';

comment on column public."Orders"."accountId" is 'The account the order is for';

comment on column public."Orders"."billingProvider" is 'The provider of the order';

comment on column public."Orders"."totalAmount" is 'The total amount for the order';

comment on column public."Orders".currency is 'The currency for the order';

comment on column public."Orders".status is 'The status of the order';

comment on column public."Orders"."billingCustomerId" is 'The billing customer ID for the order';

-- Revoke all access to Orders table for authenticated users and service_role
revoke all on public."Orders"
from
  "authenticated",
  "service_role";

-- Open up access to Orders table for authenticated users and service_role
grant
select on table public."Orders" to "authenticated";

grant
select,
  insert,
  update,
  delete on table public."Orders" to "service_role";

-- Indexes
-- Indexes on the Orders table
create index ix_orders_account_id on public."Orders" ("accountId");

-- RLS
alter table public."Orders" enable row level security;

-- SELECT(Orders)
-- Users can read orders on an account they are a member of or the account is their own
create policy orders_read_self on public."Orders" for
select
  to "authenticated" using (
    (
      "accountId" = (
        select
          auth.uid ()
      )
      and public."is_set" ('enableAccountBilling')
    )
    or (
      public."has_role_on_account" ("accountId")
      and public."is_set" ('enableTeamAccountBilling')
    )
  );

/**
 * -------------------------------------------------------
 * Section: Order Items
 * We create the schema for the order items. Order items are the items in an order.
 * -------------------------------------------------------
 */
create table if not exists
  public."OrderItems" (
    id text not null primary key,
    "orderId" text references public."Orders" (id) on delete cascade not null,
    "productId" text not null,
    "variantId" text not null,
    "priceAmount" numeric,
    quantity integer not null default 1,
    "createdAt" timestamptz not null default current_timestamp,
    "updatedAt" timestamptz not null default current_timestamp,
    unique ("orderId", "productId", "variantId")
  );

comment on table public."OrderItems" is 'The items in an order';

comment on column public."OrderItems"."orderId" is 'The order the item is for';

comment on column public."OrderItems"."productId" is 'The product ID for the item';

comment on column public."OrderItems"."variantId" is 'The variant ID for the item';

comment on column public."OrderItems"."priceAmount" is 'The price amount for the item';

comment on column public."OrderItems".quantity is 'The quantity of the item';

comment on column public."OrderItems"."createdAt" is 'The creation date of the item';

comment on column public."OrderItems"."updatedAt" is 'The last update date of the item';

-- Revoke all access to OrderItems table for authenticated users and service_role
revoke all on public."OrderItems"
from
  "authenticated",
  "service_role";

-- Open up relevant access to OrderItems table for authenticated users and service_role
grant
select on table public."OrderItems" to "authenticated",
  "service_role";

grant insert on table public."OrderItems" to "service_role";

-- Indexes on the OrderItems table
create index ix_order_items_order_id on public."OrderItems" ("orderId");

-- RLS
alter table public."OrderItems" enable row level security;

-- SELECT(OrderItems):
-- Users can read order items on an order they are a member of
create policy order_items_read_self on public."OrderItems" for
select
  to "authenticated" using (
    exists (
      select
        1
      from
        public."Orders"
      where
        id = "orderId"
        and (
          "accountId" = (
            select
              auth.uid ()
          )
          or public."has_role_on_account" ("accountId")
        )
    )
  );

-- Function "public.upsert_order"
-- Insert or update an order and its items when receiving a webhook from the billing provider
create
or replace function public."upsert_order" (
  "targetAccountId" uuid,
  "targetCustomerId" varchar(255),
  "targetOrderId" text,
  status public."PaymentStatus",
  "billingProvider" public."BillingProvider",
  "totalAmount" numeric,
  currency varchar(3),
  "lineItems" jsonb
) returns public."Orders"
set
  search_path = '' as $$
declare
    new_order public."Orders";
    new_billing_customer_id int;
begin
    insert into public."BillingCustomers"(
        "accountId",
        provider,
        "customerId")
    values (
        "targetAccountId",
        "billingProvider",
        "targetCustomerId")
on conflict (
    "accountId",
    provider,
    "customerId")
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public."Orders"(
        "accountId",
        "billingCustomerId",
        id,
        status,
        "billingProvider",
        "totalAmount",
        currency)
    values (
        "targetAccountId",
        new_billing_customer_id,
        "targetOrderId",
        status,
        "billingProvider",
        "totalAmount",
        currency)
on conflict (
    id)
    do update set
        status = excluded.status,
        "totalAmount" = excluded."totalAmount",
        currency = excluded.currency
    returning
        * into new_order;

    -- Upsert order items and delete ones that are not in the "lineItems" array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as "line_item_id",
            (line_item ->> 'product_id')::varchar as "prod_id",
            (line_item ->> 'variant_id')::varchar as "var_id",
            (line_item ->> 'price_amount')::numeric as "price_amt",
            (line_item ->> 'quantity')::integer as qty
        from
            jsonb_array_elements("lineItems") as line_item
    ),
    "line_item_ids" as (
        select "line_item_id" from item_data
    ),
    deleted_items as (
        delete from
            public."OrderItems"
        where
            public."OrderItems"."orderId" = new_order.id
            and public."OrderItems".id not in (select "line_item_id" from "line_item_ids")
        returning *
    )
    insert into public."OrderItems"(
        id,
        "orderId",
        "productId",
        "variantId",
        "priceAmount",
        quantity)
    select
        "line_item_id",
        "targetOrderId",
        "prod_id",
        "var_id",
        "price_amt",
        qty
    from
        item_data
    on conflict (id)
        do update set
            "priceAmount" = excluded."priceAmount",
            "productId" = excluded."productId",
            "variantId" = excluded."variantId",
            quantity = excluded.quantity;

    return new_order;

end;

$$ language plpgsql;

grant
execute on function public."upsert_order" (
  uuid,
  varchar,
  text,
  public."PaymentStatus",
  public."BillingProvider",
  numeric,
  varchar,
  jsonb
) to "service_role";

/**
 * -------------------------------------------------------
 * Section: Notifications
 * We create the schema for the notifications. Notifications are the notifications for an account.
 * -------------------------------------------------------
 */
create type public."NotificationChannel" as enum('in_app', 'email');

create type public."NotificationType" as enum('info', 'warning', 'error');

create table if not exists
  public."Notifications" (
    id bigint generated always as identity primary key,
    "accountId" uuid not null references public."Accounts" (id) on delete cascade,
    type public."NotificationType" not null default 'info',
    body varchar(5000) not null,
    link varchar(255),
    channel public."NotificationChannel" not null default 'in_app',
    dismissed boolean not null default false,
    "expiresAt" timestamptz default (now() + interval '1 month'),
    "createdAt" timestamptz not null default now()
  );

comment on table "Notifications" is 'The notifications for an account';

comment on column "Notifications"."accountId" is 'The account the notification is for (null for system messages)';

comment on column "Notifications".type is 'The type of the notification';

comment on column "Notifications".body is 'The body of the notification';

comment on column "Notifications".link is 'The link for the notification';

comment on column "Notifications".channel is 'The channel for the notification';

comment on column "Notifications".dismissed is 'Whether the notification has been dismissed';

comment on column "Notifications"."expiresAt" is 'The expiry date for the notification';

comment on column "Notifications"."createdAt" is 'The creation date for the notification';

-- Revoke all access to Notifications table for authenticated users and service_role
revoke all on public."Notifications"
from
  "authenticated",
  "service_role";

-- Open up relevant access to Notifications table for authenticated users and service_role
grant
select,
  update on table public."Notifications" to "authenticated",
  "service_role";

grant insert on table public."Notifications" to "service_role";

-- enable realtime
alter publication supabase_realtime
add table public."Notifications";

-- Indexes
-- Indexes on the Notifications table
-- index for selecting notifications for an account that are not dismissed and not expired
create index idx_notifications_account_dismissed on "Notifications" ("accountId", dismissed, "expiresAt");

-- RLS
alter table public."Notifications" enable row level security;

-- SELECT(Notifications):
-- Users can read notifications on an account they are a member of
create policy notifications_read_self on public."Notifications" for
select
  to "authenticated" using (
    "accountId" = (
      select
        auth.uid ()
    )
    or public."has_role_on_account" ("accountId")
  );

-- UPDATE(Notifications):
-- Users can set notifications to read on an account they are a member of
create policy notifications_update_self on public."Notifications"
for update
  to "authenticated" using (
    "accountId" = (
      select
        auth.uid ()
    )
    or public."has_role_on_account" ("accountId")
  );

-- Function "kit.update_notification_dismissed_status"
-- Make sure the only updatable field is the dismissed status and nothing else
create
or replace function kit."update_notification_dismissed_status" () returns trigger
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
update on public."Notifications" for each row
execute procedure kit."update_notification_dismissed_status" ();

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
or replace function kit."slugify" ("value" text) returns text as $$
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
execute on function kit."slugify" (text) to "service_role",
"authenticated";

-- Function "kit.set_slug_from_account_name"
-- Set the slug from the account name and increment if the slug exists
create
or replace function kit."set_slug_from_account_name" () returns trigger language plpgsql security definer
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
            tmp_slug = kit."slugify"(new.name || ' ' || increment::varchar);

        else
            tmp_slug = kit."slugify"(new.name);

        end if;

	sql_string = format('select count(1) cnt from public."Accounts" where slug = ''' || tmp_slug ||
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
create trigger "set_slug_from_account_name" before insert on public."Accounts" for each row when (
  NEW.name is not null
  and NEW.slug is null
  and NEW."isPersonalAccount" = false
)
execute procedure kit."set_slug_from_account_name" ();

-- Create a trigger when a name is updated to update the slug
create trigger "update_slug_from_account_name" before
update on public."Accounts" for each row when (
  NEW.name is not null
  and NEW.name <> OLD.name
  and NEW."isPersonalAccount" = false
)
execute procedure kit."set_slug_from_account_name" ();

-- Function "kit.setup_new_user"
-- Setup a new user account after user creation
create
or replace function kit."setup_new_user" () returns trigger language plpgsql security definer
set
  search_path = '' as $$
declare
    "user_name" text;
begin
    if new."raw_user_meta_data" ->> 'display_name' is not null then
        "user_name" := new."raw_user_meta_data" ->> 'display_name';

    end if;

    if "user_name" is null and new.email is not null then
        "user_name" := split_part(new.email, '@', 1);

    end if;

    if "user_name" is null then
        "user_name" := '';

    end if;

    insert into public."Accounts"(
        id,
        "primaryOwnerUserId",
        name,
        "isPersonalAccount",
        email)
    values (
        new.id,
        new.id,
        "user_name",
        true,
        new.email);

    return new;

end;

$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure kit."setup_new_user" ();

/**
 * -------------------------------------------------------
 * Section: Functions
 * We create the schema for the functions. Functions are the custom functions for the application.
 * -------------------------------------------------------
 */
-- Function "public.create_team_account"
-- Create a team account if team accounts are enabled
create
or replace function public."create_team_account" ("account_name" text) returns public."Accounts"
set
  search_path = '' as $$
declare
    new_account public."Accounts";
begin
    if (not public."is_set"('enableTeamAccounts')) then
        raise exception 'Team accounts are not enabled';
    end if;

    insert into public."Accounts"(
        name,
        "isPersonalAccount")
    values (
        "account_name",
        false)
returning
    * into new_account;

    return new_account;

end;

$$ language plpgsql;

grant
execute on function public."create_team_account" (text) to "authenticated",
"service_role";

-- RLS(public."Accounts")
-- Authenticated users can create team accounts
create policy create_org_account on public."Accounts" for insert to "authenticated"
with
  check (
    public."is_set" ('enableTeamAccounts')
    and public."Accounts"."isPersonalAccount" = false
  );

-- Function "public.create_invitation"
-- create an invitation to an account
create
or replace function public."create_invitation" ("accountId" uuid, email text, role varchar(50)) returns public."Invitations"
set
  search_path = '' as $$
declare
    new_invitation public."Invitations";
    "invite_token" text;
begin
    "invite_token" := extensions.uuid_generate_v4();

    insert into public."Invitations"(
        email,
        "accountId",
        "invitedBy",
        role,
        "invite_token")
    values (
        email,
        "accountId",
        auth.uid(),
        role,
        "invite_token")
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
  public."user_account_workspace"
with
  (security_invoker = true) as
select
  "Accounts".id as id,
  "Accounts".name as name,
  "Accounts"."pictureUrl" as "pictureUrl",
  (
    select
      status
    from
      public."Subscriptions"
    where
      "accountId" = "Accounts".id
    limit
      1
  ) as "subscription_status"
from
  public."Accounts"
where
  "primaryOwnerUserId" = (select auth.uid ())
  and "Accounts"."isPersonalAccount" = true
limit
  1;

grant
select
  on public."user_account_workspace" to "authenticated",
  "service_role";

--
-- VIEW "user_accounts":
-- we create a view to load the user's accounts and memberships
-- useful to display the user's accounts in the app
create or replace view
  public."user_accounts" (id, name, "pictureUrl", slug, role)
with
  (security_invoker = true) as
select
  account.id,
  account.name,
  account."pictureUrl",
  account.slug,
  membership."accountRole"
from
  public."Accounts" account
  join public."AccountsMemberships" membership on account.id = membership."accountId"
where
  membership."userId" = (select auth.uid ())
  and account."isPersonalAccount" = false
  and account.id in (
    select
      "accountId"
    from
      public."AccountsMemberships"
    where
      "userId" = (select auth.uid ())
  );

grant
select
  on public."user_accounts" to "authenticated",
  "service_role";

--
-- Function "public.team_account_workspace"
-- Load all the data for a team account workspace
create or replace function public."team_account_workspace"(account_slug text)
returns table (
  id uuid,
  name varchar(255),
  "pictureUrl" varchar(1000),
  slug text,
  role varchar(50),
  "roleHierarchyLevel" int,
  "primaryOwnerUserId" uuid,
  "subscriptionStatus" public."SubscriptionStatus",
  permissions public."AppPermissions"[]
)
set search_path to ''
as $$
begin
    return QUERY
    select
        "Accounts".id,
        "Accounts".name,
        "Accounts"."pictureUrl",
        "Accounts".slug,
        "AccountsMemberships"."accountRole",
        "Roles"."hierarchyLevel",
        "Accounts"."primaryOwnerUserId",
        "Subscriptions".status,
        array_agg("RolePermissions".permission)
    from
        public."Accounts"
        join public."AccountsMemberships" on "Accounts".id = "AccountsMemberships"."accountId"
        left join public."Subscriptions" on "Accounts".id = "Subscriptions"."accountId"
        join public."Roles" on "AccountsMemberships"."accountRole" = "Roles".name
        left join public."RolePermissions" on "AccountsMemberships"."accountRole" = "RolePermissions".role
    where
        "Accounts".slug = account_slug
        and public."AccountsMemberships"."userId" = (select auth.uid())
    group by
        "Accounts".id,
        "AccountsMemberships"."accountRole",
        "Subscriptions".status,
        "Roles"."hierarchyLevel";
end;
$$ language plpgsql;

grant
execute on function public."team_account_workspace" (text) to "authenticated",
"service_role";

-- Functions "public.get_account_members"
-- Function to get the members of an account by the account slug
create
or replace function public."get_account_members" (account_slug text) returns table (
  id uuid,
  "userId" uuid,
  "accountId" uuid,
  role varchar(50),
  "roleHierarchyLevel" int,
  "primaryOwnerUserId" uuid,
  name varchar,
  email varchar,
  "pictureUrl" varchar,
  "createdAt" timestamptz,
  "updatedAt" timestamptz
) language plpgsql
set
  search_path = '' as $$
begin
    return QUERY
    select
        acc.id,
        am."userId",
        am."accountId",
        am."accountRole",
        r."hierarchyLevel",
        a."primaryOwnerUserId",
        acc.name,
        acc.email,
        acc."pictureUrl",
        am."createdAt",
        am."updatedAt"
    from
        public."AccountsMemberships" am
        join public."Accounts" a on a.id = am."accountId"
        join public."Accounts" acc on acc.id = am."userId"
        join public."Roles" r on r.name = am."accountRole"
    where
        a.slug = account_slug;

end;

$$;

grant
execute on function public."get_account_members" (text) to "authenticated",
"service_role";

-- Function "public.get_account_invitations"
-- List the account invitations by the account slug
create
or replace function public."get_account_invitations" (account_slug text) returns table (
  id integer,
  email varchar(255),
  "accountId" uuid,
  "invitedBy" uuid,
  role varchar(50),
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  "expiresAt" timestamptz,
  "inviterName" varchar,
  "inviterEmail" varchar
)
set
  search_path = '' as $$
begin
    return query
    select
        invitation.id,
        invitation.email,
        invitation."accountId",
        invitation."invitedBy",
        invitation.role,
        invitation."createdAt",
        invitation."updatedAt",
        invitation."expiresAt",
        account.name,
        account.email
    from
        public."Invitations" as invitation
        join public."Accounts" as account on invitation."accountId" = account.id
    where
        account.slug = account_slug;

end;

$$ language plpgsql;

grant
execute on function public."get_account_invitations" (text) to "authenticated",
"service_role";

-- Function "public.add_invitations_to_account"
-- Add invitations to an account
create
or replace function public."add_invitations_to_account" (
  account_slug text,
  invitations public."Invitation"[]
) returns public."Invitations"[]
set
  search_path = '' as $$
declare
    new_invitation public."Invitations";
    all_invitations public."Invitations"[] := array[]::public."Invitations"[];
    "inviteToken" text;
    email text;
    role varchar(50);
begin
    FOREACH email,
    role in array invitations loop
        "inviteToken" := extensions.uuid_generate_v4();

        insert into public."Invitations"(
            email,
            "accountId",
            "invitedBy",
            role,
            "inviteToken")
        values (
            email,
            (
                select
                    id
                from
                    public."Accounts"
                where
                    slug = account_slug), auth.uid(), role, "inviteToken")
    returning
        * into new_invitation;

        all_invitations := array_append(all_invitations, new_invitation);

    end loop;

    return all_invitations;

end;

$$ language plpgsql;

grant
execute on function public."add_invitations_to_account" (text, public."Invitation"[]) to "authenticated",
"service_role";

-- Function "public.has_active_subscription"
-- Check if a user has an active subscription on an account - ie. it's trialing or active
-- Useful to gate access to features that require a subscription
create
or replace function public."has_active_subscription" ("targetAccountId" uuid) returns boolean
set
  search_path = '' as $$
begin
    return exists (
        select
            1
        from
            public."Subscriptions"
        where
            "accountId" = "targetAccountId"
            and active = true);

end;

$$ language plpgsql;

grant
execute on function public."has_active_subscription" (uuid) to "authenticated",
"service_role";

-- Storage
-- Account Image
insert into
  storage.buckets (id, name, "public")
values
  ('account_image', 'account_image', true);

-- Function: get the storage filename as a UUID.
-- Useful if you want to name files with UUIDs related to an account
create
or replace function kit."get_storage_filename_as_uuid" (name text) returns uuid
set
  search_path = '' as $$
begin
    return replace(storage.filename(name), concat('.',
	storage.extension(name)), '')::uuid;

end;

$$ language plpgsql;

grant
execute on function kit."get_storage_filename_as_uuid" (text) to "authenticated",
"service_role";

-- RLS policies for storage
create policy account_image on storage.objects for all using (
  "bucket_id" = 'account_image'
  and kit."get_storage_filename_as_uuid" (name) = (
    select
      auth.uid ()
  )
  or public."has_role_on_account" (kit."get_storage_filename_as_uuid" (name))
)
with
  check (
    "bucket_id" = 'account_image'
    and (kit."get_storage_filename_as_uuid" (name) = (
      select
        auth.uid ()
    )
    or public."has_permission" (
      auth.uid (),
      kit."get_storage_filename_as_uuid" (name),
      'settings.manage'
    ))
  );


