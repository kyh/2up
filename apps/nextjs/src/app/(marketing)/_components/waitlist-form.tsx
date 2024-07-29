"use client";

import { joinWaitlistInput } from "@init/api/waitlist/waitlist-schema";
import { Button } from "@init/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import { toast } from "@init/ui/toast";

import type { TRPCError } from "@/trpc/react";
import type { JoinWaitlistInput } from "@init/api/waitlist/waitlist-schema";
import { api } from "@/trpc/react";

export const WaitlistForm = () => {
  const joinWaitlist = api.waitlist.join.useMutation();

  const form = useForm({
    schema: joinWaitlistInput,
    defaultValues: {
      email: "",
    },
  });

  const handleJoinWaitlist = async (values: JoinWaitlistInput) => {
    toast.promise(joinWaitlist.mutateAsync({ email: values.email }), {
      loading: "Submitting...",
      success: "Waitlist joined!",
      error: "Failed to join waitlist",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleJoinWaitlist)}
        className="mt-10 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-input shadow-lg"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="min-w-0 flex-1 space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <input
                  className="w-full border-none bg-transparent py-3 pl-4 text-sm placeholder-white/50 focus:placeholder-white/75 focus:outline-none focus:ring-0"
                  required
                  type="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage className="absolute pt-1" />
            </FormItem>
          )}
        />
        <Button
          className="text-xs"
          variant="ghost"
          loading={joinWaitlist.isPending}
        >
          Join Waitlist
        </Button>
      </form>
    </Form>
  );
};
