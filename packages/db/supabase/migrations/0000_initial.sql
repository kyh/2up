-- Handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    counter INTEGER := 0;
    new_team_id UUID;
    team_slug TEXT;
    current_meta_data JSONB;
BEGIN
    -- Generate a URL-safe slug
    base_slug := lower(regexp_replace(NEW.email, '@.*$', '')); -- Get email prefix
    base_slug := regexp_replace(base_slug, '[^a-z0-9]', '-', 'g'); -- Replace non-alphanumeric with hyphen
    base_slug := regexp_replace(base_slug, '-+', '-', 'g'); -- Replace multiple hyphens with single hyphen
    base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g'); -- Remove leading/trailing hyphens
    
    -- Set initial team_slug
    team_slug := base_slug;
    
    -- Keep trying until we find a unique slug
    LOOP
        EXIT WHEN NOT EXISTS (
            SELECT 1 
            FROM public.teams 
            WHERE teams.slug = team_slug
        );
        counter := counter + 1;
        team_slug := base_slug || '-' || counter::text;
    END LOOP;

    -- Create a new team
    BEGIN
        INSERT INTO public.teams (name, slug)
        VALUES (
            'Personal Team',
            team_slug
        )
        RETURNING id INTO new_team_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create team: %', SQLERRM;
    END;

    -- Add the user as an owner to the team
    BEGIN
        INSERT INTO public.team_members (user_id, team_id, role)
        VALUES (NEW.id, new_team_id, 'owner');
    EXCEPTION WHEN OTHERS THEN
        -- Cleanup the team if member creation fails
        DELETE FROM public.teams WHERE id = new_team_id;
        RAISE EXCEPTION 'Failed to create team member: %', SQLERRM;
    END;

    -- Update user's raw_user_meta_data with defaultTeam
    BEGIN
        -- Get current meta data or initialize empty object if null
        current_meta_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
        
        -- Update auth.users with new meta data including defaultTeam
        UPDATE auth.users 
        SET raw_user_meta_data = current_meta_data || jsonb_build_object(
            'defaultTeamSlug', team_slug
        )
        WHERE id = NEW.id;
    EXCEPTION WHEN OTHERS THEN
        -- Cleanup if metadata update fails
        DELETE FROM public.team_members WHERE user_id = NEW.id AND team_id = new_team_id;
        DELETE FROM public.teams WHERE id = new_team_id;
        RAISE EXCEPTION 'Failed to update user metadata: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create the storage bucket for avatars
INSERT INTO storage.buckets
  (id, name, public)
VALUES
  ('avatars', 'avatars', true);

-- Allow authenticated users to upload only to their own folder
CREATE POLICY "Users can upload avatar to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update/replace only their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete only their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');