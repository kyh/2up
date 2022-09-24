/**
* This trigger automatically creates a Profile entry when a new user signs up
* via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into "public"."Profile" ("userId", email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
