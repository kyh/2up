DROP TYPE IF EXISTS "public"."notification_channel" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."notification_type" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."task_label" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."task_priority" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."task_status" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."waitlist_type" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'error');--> statement-breakpoint
CREATE TYPE "public"."task_label" AS ENUM('bug', 'feature', 'enhancement', 'documentation');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in-progress', 'done', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."waitlist_type" AS ENUM('app');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"invited_by" uuid NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "notification_type" DEFAULT 'info' NOT NULL,
	"body" varchar(5000) NOT NULL,
	"link" varchar(255),
	"channel" "notification_channel" DEFAULT 'in_app' NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '1 mon'::interval),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid,
	"slug" text,
	"title" text,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"label" "task_label" DEFAULT 'bug' NOT NULL,
	"priority" "task_priority" DEFAULT 'low' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"user_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_user_id_team_id_pk" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"plan_name" varchar(50),
	"subscription_status" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "teams_slug_unique" UNIQUE("slug"),
	CONSTRAINT "teams_stripeCustomerId_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "teams_stripeSubscriptionId_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "waitlist_type" DEFAULT 'app' NOT NULL,
	"email" text,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_team_id UUID;
    team_slug TEXT;
    current_meta_data JSONB;
BEGIN
    -- Generate a URL-safe slug:
    -- 1. Take email prefix before @
    -- 2. Convert to lowercase
    -- 3. Replace any non-alphanumeric characters with hyphens
    -- 4. Remove multiple consecutive hyphens
    -- 5. Remove leading and trailing hyphens
    team_slug := lower(regexp_replace(NEW.email, '@.*$', '')); -- Get email prefix
    team_slug := regexp_replace(team_slug, '[^a-z0-9]', '-', 'g'); -- Replace non-alphanumeric with hyphen
    team_slug := regexp_replace(team_slug, '-+', '-', 'g'); -- Replace multiple hyphens with single hyphen
    team_slug := regexp_replace(team_slug, '^-+|-+$', '', 'g'); -- Remove leading/trailing hyphens
    
    -- Append a random string if slug already exists
    WHILE EXISTS (SELECT 1 FROM public.teams WHERE slug = team_slug) LOOP
        team_slug := team_slug || '-' || substring(
            regexp_replace(
                encode(gen_random_bytes(6), 'base64'), 
                '[^a-z0-9]', 
                '', 
                'g'
            ) 
            from 1 for 6
        );
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
        SET raw_user_meta_data = current_meta_data || jsonb_build_object('defaultTeam', new_team_id)
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