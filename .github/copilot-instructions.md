You are an expert in Next.js, TypeScript, and React 19. You produce clear, readable code using best practices

## Behavior Guidelines

- Respond in a friendly and concise manner
- Provide complete, self-contained solutions
- Default to current best practices
- Ask clarifying questions when requirements are ambiguous

## Code Standards

- Generate code in TypeScript by default unless JavaScript is specifically requested
- Never bake in secrets into the code
- Include proper error handling and logging
- Add appropriate TypeScript types and interfaces
- Include comments explaining complex logic
- Follow a consistent naming convention, such as camelCase for variable and function names.
- Use a functional programming style
- Use always TailwindCSS for css styles
- Import path aliases (@/\*) for any local app references

# Project Structure

This is a Turborepo monorepo with apps and packages structure. It's originally based off the T3 stack. The apps are Next.js/Expo applications, and the packages are shared libraries and services.

```
apps/nextjs/app/                          # Root directory (apps/web/app)
├── (marketing)/              # Marketing pages group
├── (auth)/                   # Authentication pages group
├── (dashboard)/              # Dashboard pages group
└── (docs)/                   # Documentation pages group

packages/                     # Shared libraries and services
├── api/                      # TRPC API routes and schemas
├── db/                       # Drizzle and Supabase database schema and migrations
└── ui/                       # Shared UI components (Shadcn components)
```

# Querying Data

- Use the apis from `@tanstack/react-query` for data fetching and caching
- Use `import { useTRPC } from "@/trpc/react"` for the trpc query options

Example:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

const Page = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.notes.getNotes.queryOptions());

  return (
    ...
  );
}
```

# Mutating data

1. Define a Zod schema
2. Create a TRPC route to handle the form submission
3. Create a form component to handle the form submission

## Zod Schema

Define the crud operations as a Zod schema in the `packages/api/src/[entity]` folder. Name the file `[entity]-schema.ts`.

Follow the example below to create all api schemas:

```ts
// packages/api/src/note/note-schema.ts
import { z } from "zod";

/**
 * Create schema
 */
export const createNoteInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
export type CreateNoteInput = z.infer<typeof createNoteInput>;

/**
 * Update schema
 */
export const updateNoteInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
});
export type UpdateNoteInput = z.infer<typeof updateNoteInput>;

/**
 * Delete schema
 */
export const deleteNoteInput = z.object({
  id: z.string().uuid(),
});
export type DeleteNoteInput = z.infer<typeof deleteNoteInput>;

/**
 * Get schema
 */
export const getNoteInput = z.object({
  id: z.string().uuid(),
});
export type GetNoteInput = z.infer<typeof getNoteInput>;
```

## TRPC Route

Create or update a TRPC route to handle the form submission in the `packages/api/src/[entity]` folder.

Name the file `[entity]-router.ts`.

Follow the example below to create all api routes:

```ts
// packages/api/src/note/note-router.ts
import { trpc } from "@trpc/server";
import { z } from "zod";

import {
  createNoteInput,
  deleteNoteInput,
  getNoteInput,
  updateNoteInput,
} from "./note-schema";

export const noteRouter = trpc.router({
  createNote: trpc.mutation
    .input(createNoteInput)
    .resolve(async ({ input }) => {
      // Create note logic
      return { id: "1", ...input };
    }),
  updateNote: trpc.mutation
    .input(updateNoteInput)
    .resolve(async ({ input }) => {
      // Update note logic
      return { id: input.id, ...input };
    }),
  deleteNote: trpc.mutation
    .input(deleteNoteInput)
    .resolve(async ({ input }) => {
      // Delete note logic
      return { id: input.id };
    }),
  getNote: trpc.query.input(getNoteInput).resolve(async ({ input }) => {
    // Get note logic
    return { id: input.id, title: "Note title", content: "Note content" };
  }),
});
```

## Forms

- Use React Hook Form for form validation and submission
- Use Zod for form validation
- No need to revalidate react query on submission since we automatically revalidate the entire page

Follow the example below to create all forms:

```tsx
// apps/nextjs/src/app/notes/_components/create-note-form.tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@kyhui/form";
import { createNoteInput } from "@repo/api/note/note-schema";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/react";

export const CreateNoteForm = () => {
  const trpc = useTRPC();
  const createNoteMutation = useMutation(
    trpc.note.createNote.mutationOptions(),
  );

  const form = useForm({
    schema: createNoteInput,
  });

  const onSubmit = (data) => {
    createNoteMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

# UI Components

- Reusable UI components are defined in the "packages/ui" package named "@kyhui".
- By exporting the component from the "exports" field, we can import it using the "@kyhui/{component-name}" format.

## Styling

- Styling is done using Tailwind CSS. We use the "cn" function from the "@kyhui/utils" package to generate class names.
- Avoid fixed classes such as "bg-gray-500". Instead, use Shadcn classes such as "bg-background", "text-secondary-foreground", "text-muted-foreground", etc.

## Importing Components

```tsx
// Import UI components
import { Button } from "@kyhui/button";
import { Card } from "@kyhui/card";
```

# Database Rules

## Database Architecture

- We use Supabase as our Postgres database provider
- Drizzle is the ORM we use to interact with the database, only use the Supabase client directly when necessary (such as calling functions)
- We strive to create a safe, robust, performant schema

## Migrations

- The Drizzle schema, `packages/db/src/schema.ts`, is the source of truth for the database schema
- We typically don’t wanna deal with SQL migration files. We want Drizzle to “push” my schema directly to the database (`pnpm db:push`)
- However, if we need something Drizzle doesn’t support, we can create a migration file (`packages/db/supabase/migrations`)

## Security & RLS

- We don't use RLS by default because rows are accessed through the API, which is already secured
- However, if the table needs direct client access, enable RLS for the table

## Schema Overview

### Core Entity Relationships

1. `users`:

   - This table is created by Supabase. It represents a authed user account
   - Refer to Supabase auth docs for more info

2. `teams` and `team_members`:

   - Each user has a personal team account (1:1), but can create more if needed
   - Users are `team_members` of that team
   - They are of the `member` role by default (could be owner, admin, member)

3. `invitations`:
   - Users can invite others to their team
