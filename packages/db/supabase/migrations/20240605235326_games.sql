create type public."QuestionType" as ENUM('text', 'image', 'video', 'audio', 'code');
create type public."AnswerType" as ENUM('text', 'multiText');

create table if not exists
  public."Packs" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),

    "name" text,
    "description" text,
    "image" text,
    "tags" text[],
    "gameLength" integer default 10 not null,
    "isRandom" boolean default true not null,
    "isPublic" boolean default false not null,
    "isPublished" boolean default false not null,

    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "createdBy" uuid references auth.users,
    "updatedBy" uuid references auth.users,

    primary key (id)
  );

create table if not exists
  public."Scenes" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),

    "packId" uuid references public."Packs" (id) on delete cascade,
    "question" text,
    "questionDescription" text,
    "questionType" public."QuestionType" default 'text' not null,

    "answer" jsonb,
    "answerDescription" text,
    "answerType" public."AnswerType" default 'text' not null,

    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "createdBy" uuid references auth.users,
    "updatedBy" uuid references auth.users,
    
    primary key (id)
  );

create table if not exists
  public."Games" (
    "id" uuid unique not null default extensions.uuid_generate_v4 (),
    
    "code" text unique,
    "history" jsonb,
    "gameScenes" jsonb,
    "isStarted" boolean default false not null,
    "isFinished" boolean default false not null,
    "packId" uuid references public."Packs" (id),
    
    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "createdBy" uuid references auth.users,
    "updatedBy" uuid references auth.users,
    
    primary key (id)
  );

create or replace function public."updateGameState"(
    "gameId" uuid,
    "gameState" JSONB
) returns void as $$
begin
    update public."Games"
    set history = 
        case 
            when jsonb_typeof(history) = 'array' then history || "gameState"
            else jsonb_build_array(history) || "gameState"
        end,
        isStarted = ("gameState"->>'currentView' <> 'lobby'),
        isFinished = ("gameState"->>'currentView' = 'leaderboard')
    where id = gameId;
end;
$$ language plpgsql;