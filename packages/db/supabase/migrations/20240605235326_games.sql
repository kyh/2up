create type public.question_type as ENUM('text', 'image', 'video', 'audio', 'code');
create type public.answer_type as ENUM('text', 'multiText');

create table if not exists
  public.packs (
    id uuid unique not null default extensions.uuid_generate_v4 (),

    name text,
    description text,
    image text,
    tags text[],
    game_length integer default 10 not null,
    is_random boolean default true not null,
    is_public boolean default false not null,
    is_published boolean default false not null,

    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,

    primary key (id)
  );

create table if not exists
  public.scenes (
    id uuid unique not null default extensions.uuid_generate_v4 (),

    pack_id uuid references public.packs (id) on delete cascade,
    question text,
    question_description text,
    question_type question_type default 'text' not null,

    answer jsonb,
    answer_description text,
    answer_type answer_type default 'text' not null,

    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    
    primary key (id)
  );

create table if not exists
  public.games (
    id uuid unique not null default extensions.uuid_generate_v4 (),
    
    code text unique,
    history jsonb,
    game_scenes jsonb,
    is_started boolean default false not null,
    is_finished boolean default false not null,
    pack_id uuid references public.packs (id),
    
    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    
    primary key (id)
  );

create or replace function update_game_state(
    game_id uuid,
    game_state JSONB
) returns void as $$
begin
    update games
    set history = 
        case 
            when jsonb_typeof(history) = 'array' then history || game_state
            else jsonb_build_array(history) || game_state
        end,
        is_started = (game_state->>'currentView' <> 'lobby'),
        is_finished = (game_state->>'currentView' = 'leaderboard')
    where id = game_id;
end;
$$ language plpgsql;