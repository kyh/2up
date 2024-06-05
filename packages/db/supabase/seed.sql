-- WEBHOOKS SEED
-- PLEASE NOTE: These webhooks are only for development purposes. Leave them as they are or add new ones.

-- These webhooks are only for development purposes.
-- In production, you should manually create webhooks in the Supabase dashboard (or create a migration to do so).
-- We don't do it because you'll need to manually add your webhook URL and secret key.

-- this webhook will be triggered after deleting an account
create trigger "accounts_teardown" after delete
on "public"."accounts" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:3000/api/db/webhook',
  'POST',
  '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
  '{}',
  '5000'
);

-- this webhook will be triggered after a delete on the subscriptions table
-- which should happen when a user deletes their account (and all their subscriptions)
create trigger "subscriptions_delete" after delete
on "public"."subscriptions" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:3000/api/db/webhook',
  'POST',
  '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
  '{}',
  '5000'
);

-- this webhook will be triggered after every insert on the invitations table
-- which should happen when a user invites someone to their account
create trigger "invitations_insert" after insert
on "public"."invitations" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:3000/api/db/webhook',
  'POST',
  '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
  '{}',
  '5000'
);


-- DATA SEED
-- This is a data dump for testing purposes. It should be used to seed the database with data for testing.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
        ('00000000-0000-0000-0000-000000000000', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'authenticated', 'authenticated', 'custom@kyh.io', '$2a$10$b3ZPpU6TU3or30QzrXnZDuATPAx2pPq3JW.sNaneVY3aafMSuR4yi', '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL, '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "custom@kyh.io", "email_verified": false, "phone_verified": false}', NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
        ('00000000-0000-0000-0000-000000000000', '31a03e74-1639-45b6-bfa7-77447f1a4762', 'authenticated', 'authenticated', 'test@kyh.io', '$2a$10$NaMVRrI7NyfwP.AfAVWt6O/abulGnf9BBqwa6DqdMwXMvOCGpAnVO', '2024-04-20 08:20:38.165331+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-04-20 09:36:02.521776+00', '{"provider": "email", "providers": ["email"], "role": "super-admin"}', '{"sub": "31a03e74-1639-45b6-bfa7-77447f1a4762", "email": "test@kyh.io", "email_verified": false, "phone_verified": false}', NULL, '2024-04-20 08:20:34.459113+00', '2024-04-20 10:07:48.554125+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
        ('00000000-0000-0000-0000-000000000000', '5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', 'authenticated', 'authenticated', 'owner@kyh.io', '$2a$10$D6arGxWJShy8q4RTW18z7eW0vEm2hOxEUovUCj5f3NblyHfamm5/a', '2024-04-20 08:36:37.517993+00', NULL, '', '2024-04-20 08:36:27.639648+00', '', NULL, '', '', NULL, '2024-04-20 08:36:37.614337+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf", "email": "owner@kyh.io", "email_verified": false, "phone_verified": false}', NULL, '2024-04-20 08:36:27.630379+00', '2024-04-20 08:36:37.617955+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
        ('00000000-0000-0000-0000-000000000000', '6b83d656-e4ab-48e3-a062-c0c54a427368', 'authenticated', 'authenticated', 'member@kyh.io', '$2a$10$6h/x.AX.6zzphTfDXIJMzuYx13hIYEi/Iods9FXH19J2VxhsLycfa', '2024-04-20 08:41:15.376778+00', NULL, '', '2024-04-20 08:41:08.689674+00', '', NULL, '', '', NULL, '2024-04-20 08:41:15.484606+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "6b83d656-e4ab-48e3-a062-c0c54a427368", "email": "member@kyh.io", "email_verified": false, "phone_verified": false}', NULL, '2024-04-20 08:41:08.683395+00', '2024-04-20 08:41:15.485494+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
 ('31a03e74-1639-45b6-bfa7-77447f1a4762', '31a03e74-1639-45b6-bfa7-77447f1a4762', '{"sub": "31a03e74-1639-45b6-bfa7-77447f1a4762", "email": "test@kyh.io", "email_verified": false, "phone_verified": false}', 'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00', '9bb58bad-24a4-41a8-9742-1b5b4e2d8abd'),        ('5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', '5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', '{"sub": "5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf", "email": "owner@kyh.io", "email_verified": false, "phone_verified": false}', 'email', '2024-04-20 08:36:27.637388+00', '2024-04-20 08:36:27.637409+00', '2024-04-20 08:36:27.637409+00', '090598a1-ebba-4879-bbe3-38d517d5066f'),
        ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "custom@kyh.io", "email_verified": false, "phone_verified": false}', 'email', '2024-04-20 08:37:43.342194+00', '2024-04-20 08:37:43.342218+00', '2024-04-20 08:37:43.342218+00', '4392e228-a6d8-4295-a7d6-baed50c33e7c'),
        ('6b83d656-e4ab-48e3-a062-c0c54a427368', '6b83d656-e4ab-48e3-a062-c0c54a427368', '{"sub": "6b83d656-e4ab-48e3-a062-c0c54a427368", "email": "member@kyh.io", "email_verified": false, "phone_verified": false}', 'email', '2024-04-20 08:41:08.687948+00', '2024-04-20 08:41:08.687982+00', '2024-04-20 08:41:08.687982+00', 'd122aca5-4f29-43f0-b1b1-940b000638db');

--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."accounts" ("id", "primary_owner_user_id", "name", "slug", "email", "is_personal_account", "updated_at", "created_at", "created_by", "updated_by", "picture_url", "public_data") VALUES
        ('5deaa894-2094-4da3-b4fd-1fada0809d1c', '31a03e74-1639-45b6-bfa7-77447f1a4762', 'Init', 'init', NULL, false, NULL, NULL, NULL, NULL, NULL, '{}');

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("name", "hierarchy_level") VALUES
        ('custom-role', 4);

--
-- Data for Name: accounts_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."accounts_memberships" ("user_id", "account_id", "account_role", "created_at", "updated_at", "created_by", "updated_by") VALUES
        ('31a03e74-1639-45b6-bfa7-77447f1a4762', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'owner', '2024-04-20 08:21:16.802867+00', '2024-04-20 08:21:16.802867+00', NULL, NULL),
        ('5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'owner', '2024-04-20 08:36:44.21028+00', '2024-04-20 08:36:44.21028+00', NULL, NULL),
        ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'custom-role', '2024-04-20 08:38:02.50993+00', '2024-04-20 08:38:02.50993+00', NULL, NULL),
        ('6b83d656-e4ab-48e3-a062-c0c54a427368', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'member', '2024-04-20 08:41:17.833709+00', '2024-04-20 08:41:17.833709+00', NULL, NULL);


--
-- Data for Name: billing_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: billing_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."billing_customers_id_seq"', 1, false);


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."invitations_id_seq"', 19, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."role_permissions_id_seq"', 7, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 19, true);
