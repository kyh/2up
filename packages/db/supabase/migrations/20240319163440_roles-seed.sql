-- Seed the Roles table with default roles 'owner' and 'member'
insert into public."Roles"(
    "name",
    "hierarchyLevel")
values (
    'owner',
    1);

insert into public."Roles"(
    "name",
    "hierarchyLevel")
values (
    'member',
    2);

-- We seed the RolePermissions table with the default roles and permissions
insert into public."RolePermissions"(
  "role",
  "permission")
values (
  'owner',
  'roles.manage'),
(
  'owner',
  'billing.manage'),
(
  'owner',
  'settings.manage'),
(
  'owner',
  'members.manage'),
(
  'owner',
  'invites.manage'),
(
  'member',
  'settings.manage'),
(
  'member',
  'invites.manage');
