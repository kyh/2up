"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@init/db/supabase-browser-client";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/trpc/react";

export const useNotificationsStream = ({
  accountIds = [],
  realtime = true,
}: {
  accountIds?: string[];
  realtime?: boolean;
} = {}) => {
  const [notifications, { isLoading, refetch }] =
    api.notifications.fetchNotifications.useSuspenseQuery({
      accountIds,
    });

  const client = getSupabaseBrowserClient();

  const { data: subscription } = useQuery({
    enabled: realtime,
    queryKey: ["realtime-notifications", ...accountIds],
    queryFn: () => {
      const channel = client.channel("notifications-channel");
      return channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            filter: `accountId=in.(${accountIds.join(", ")})`,
            table: "Notifications",
          },
          () => refetch(),
        )
        .subscribe();
    },
  });

  useEffect(() => {
    return () => {
      void subscription?.unsubscribe();
    };
  }, [subscription]);

  return {
    notifications,
    isLoading,
    refetch,
  };
};
