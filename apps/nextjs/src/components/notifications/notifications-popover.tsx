"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@init/ui/button";
import { Divider } from "@init/ui/divider";
import { If } from "@init/ui/if";
import { Popover, PopoverContent, PopoverTrigger } from "@init/ui/popover";
import { cn } from "@init/ui/utils";
import { Bell, CircleAlert, Info, TriangleAlert, XIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import { useFetchNotifications } from "@/hooks/use-fetch-notifications";
import { api } from "@/trpc/react";

type Notification = RouterOutputs["notifications"]["fetchNotifications"][0];

type PartialNotification = Pick<
  Notification,
  "id" | "body" | "dismissed" | "type" | "createdAt" | "link"
>;

export const NotificationsPopover = (params: {
  realtime: boolean;
  accountIds: string[];
  onClick?: (notification: PartialNotification) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<PartialNotification[]>([]);

  const onNotifications = useCallback(
    (notifications: PartialNotification[]) => {
      setNotifications((existing) => {
        const unique = new Set(existing.map((notification) => notification.id));

        const notificationsFiltered = notifications.filter(
          (notification) => !unique.has(notification.id),
        );

        return [...notificationsFiltered, ...existing];
      });
    },
    [],
  );

  const dismissNotification =
    api.notifications.dismissNotification.useMutation();

  useFetchNotifications({
    onNotifications,
    accountIds: params.accountIds,
    realtime: params.realtime,
  });

  const timeAgo = (createdAt: string) => {
    const date = new Date(createdAt);

    let time: number;

    const daysAgo = Math.floor(
      (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    const formatter = new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    });

    if (daysAgo < 1) {
      time = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));

      if (time < 5) {
        return "Just now";
      }

      if (time < 60) {
        return formatter.format(-time, "minute");
      }

      const hours = Math.floor(time / 60);

      return formatter.format(-hours, "hour");
    }

    const unit = (() => {
      const minutesAgo = Math.floor(
        (new Date().getTime() - date.getTime()) / (1000 * 60),
      );

      if (minutesAgo <= 60) {
        return "minute";
      }

      if (daysAgo <= 1) {
        return "hour";
      }

      if (daysAgo <= 30) {
        return "day";
      }

      if (daysAgo <= 365) {
        return "month";
      }

      return "year";
    })();

    const text = formatter.format(-daysAgo, unit);

    return text.slice(0, 1).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, []);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="relative h-10 w-10 rounded-lg" variant="ghost">
          <Bell className="h-5 w-5" />

          <span
            className={cn(
              `absolute right-1 top-1 mt-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.65rem] text-white animate-in fade-in zoom-in`,
              {
                hidden: !notifications.length,
              },
            )}
          >
            {notifications.length}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="flex w-full max-w-96 flex-col p-0 lg:min-w-64"
        align="start"
        collisionPadding={20}
        sideOffset={10}
      >
        <div className="flex items-center px-3 py-2 text-sm font-semibold">
          Notifications
        </div>

        <Divider />

        <If condition={!notifications.length}>
          <div className="px-3 py-2 text-sm">No notifications</div>
        </If>

        <div className="flex max-h-[60vh] flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
          {notifications.map((notification) => {
            const maxChars = 100;

            let body = notification.body;

            if (body.length > maxChars) {
              body = body.substring(0, maxChars) + "...";
            }

            const Icon = () => {
              switch (notification.type) {
                case "warning":
                  return <TriangleAlert className="h-4 text-yellow-500" />;
                case "error":
                  return <CircleAlert className="h-4 text-destructive" />;
                default:
                  return <Info className="h-4 text-blue-500" />;
              }
            };

            return (
              <div
                key={notification.id.toString()}
                className={cn(
                  "min-h-18 flex flex-col items-start justify-center space-y-0.5 px-3 py-2",
                )}
                onClick={() => {
                  if (params.onClick) {
                    params.onClick(notification);
                  }
                }}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex items-start justify-start space-x-2 py-2">
                    <div className="py-0.5">
                      <Icon />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <div className="text-sm">
                        <If condition={notification.link} fallback={body}>
                          {(link) => (
                            <a href={link} className="hover:underline">
                              {body}
                            </a>
                          )}
                        </If>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="py-2">
                    <Button
                      className="max-h-6 max-w-6"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setNotifications((existing) => {
                          return existing.filter(
                            (existingNotification) =>
                              existingNotification.id !== notification.id,
                          );
                        });

                        return dismissNotification.mutateAsync({
                          notification: notification.id,
                        });
                      }}
                    >
                      <XIcon className="h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
