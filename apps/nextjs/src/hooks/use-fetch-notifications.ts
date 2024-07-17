import { useEffect } from "react";
import { RouterOutputs } from "@init/api";

import { api } from "@/trpc/react";
import { useNotificationsStream } from "./use-notifications-stream";

type Notification = RouterOutputs["notifications"]["fetchNotifications"][0];

export function useFetchNotifications({
  onNotifications,
  accountIds,
  realtime,
}: {
  onNotifications: (notifications: Notification[]) => unknown;
  accountIds: string[];
  realtime: boolean;
}) {
  const { data: initialNotifications } =
    api.notifications.fetchNotifications.useQuery({
      accountIds,
    });

  useNotificationsStream({
    onNotifications,
    accountIds,
    enabled: realtime,
  });

  useEffect(() => {
    if (initialNotifications) {
      onNotifications(initialNotifications);
    }
  }, [initialNotifications, onNotifications]);
}
