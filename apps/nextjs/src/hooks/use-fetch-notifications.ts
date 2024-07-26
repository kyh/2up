import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@init/db/supabase-browser-client";
import { useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/react";

type Notification = RouterOutputs["notifications"]["fetchNotifications"][0];

export const useFetchNotifications = ({
  onNotifications,
  accountIds,
  realtime,
}: {
  onNotifications: (notifications: Notification[]) => unknown;
  accountIds: string[];
  realtime: boolean;
}) => {
  const [initialNotifications] =
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
          (payload) => {
            onNotifications([payload.new as Notification]);
          },
        )
        .subscribe();
    },
  });

  useEffect(() => {
    return () => {
      void subscription?.unsubscribe();
    };
  }, [subscription]);

  useEffect(() => {
    if (initialNotifications) {
      onNotifications(initialNotifications);
    }
  }, [initialNotifications, onNotifications]);
};
