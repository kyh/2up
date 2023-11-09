"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Card } from "@/components";
import { useSupabase } from "@/components/providers/supabase-provider";

type FormInputs = {
  email: string;
  idea: string;
};

export default function RequestPage() {
  const { supabase } = useSupabase();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async ({ email, idea }: FormInputs) => {
    setIsLoading(true);
    try {
      await supabase.from("Waitlist").insert({ data: { email, idea } });
      setIsComplete(true);
    } catch (e) {
      console.error(e);
      setIsComplete(false);
    }
    setIsLoading(false);
  };

  return (
    <section className="desktop:max-w-lg mx-auto translate-y-[-70px]">
      <h1 className="mb-5 text-center text-4xl font-bold">🎉 Welcome!</h1>
      <p className="mb-5">
        Interested in building your own Packs? Join our Pack Creator beta
        program to build, test, and play your own games.
      </p>
      <Card background>
        {isComplete ? (
          <div>
            Thanks for your interest! We&apos;ll be distributing logins soon
          </div>
        ) : (
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="email"
              labelText="Email"
              placeholder="beta-tester@2uphq.com"
              error={!!errors.email}
              errorText="This field is required"
              fullWidth
              {...register("email", { required: true })}
            />
            <TextField
              id="idea"
              labelText="Got a pack idea?"
              placeholder="Who's that Pokemon?"
              fullWidth
              {...register("idea")}
            />
            <Button
              className="mt-4"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              Request Invite
            </Button>
          </form>
        )}
      </Card>
      <p className="mt-2 text-center">
        You can also find us on{" "}
        <a
          className="underline"
          href="https://discord.gg/Rt8ygmQ4fk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>
      </p>
    </section>
  );
}
