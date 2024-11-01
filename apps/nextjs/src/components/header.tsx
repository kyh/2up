"use client";

import { useState } from "react";
import { Button } from "@init/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@init/ui/command";
import { If } from "@init/ui/if";
import { Popover, PopoverContent, PopoverTrigger } from "@init/ui/popover";
import { cn } from "@init/ui/utils";
import {
  Bell,
  CircleAlert,
  Info,
  SearchIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { useNotificationsStream } from "@/lib/use-notifications-stream";
import { api } from "@/trpc/react";

type PageHeaderProps = {
  children: React.ReactNode;
  showNotifications?: boolean;
  showSearch?: boolean;
};

export const PageHeader = ({
  children,
  showSearch = false,
  showNotifications = false,
}: PageHeaderProps) => {
  return (
    <header className="flex h-20 items-center justify-between md:h-24">
      <h1 className="text-xl">{children}</h1>
      <div className="flex gap-1">
        {/* {showNotifications && <NotificationsButton />} */}
        {/* {showSearch && <SearchButton />} */}
      </div>
    </header>
  );
};

// const SearchButton = () => {
//   const [open, setOpen] = useState(false);

//   const onClick = () => {
//     setOpen((prev) => !prev);
//   };

//   useHotkeys("cmd+k", onClick);

//   return (
//     <>
//       <Button
//         className="rounded-full"
//         variant="ghost"
//         size="icon"
//         onClick={onClick}
//       >
//         <SearchIcon className="size-4" />
//         <span className="sr-only">Search</span>
//       </Button>
//       <CommandDialog open={open} onOpenChange={setOpen}>
//         <CommandInput placeholder="Type a command or search..." />
//         <CommandList>
//           <CommandEmpty>No results found.</CommandEmpty>
//           <CommandGroup heading="Suggestions"></CommandGroup>
//         </CommandList>
//       </CommandDialog>
//     </>
//   );
// };

// export const NotificationsButton = () => {
//   const [open, setOpen] = useState(false);
//   const dismissNotification =
//     api.notifications.dismissNotification.useMutation();
//   const { notifications, refetch } = useNotificationsStream();

//   const timeAgo = (createdAt: string) => {
//     const date = new Date(createdAt);

//     let time: number;

//     const daysAgo = Math.floor(
//       (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
//     );

//     const formatter = new Intl.RelativeTimeFormat("en", {
//       numeric: "auto",
//     });

//     if (daysAgo < 1) {
//       time = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));

//       if (time < 5) {
//         return "Just now";
//       }

//       if (time < 60) {
//         return formatter.format(-time, "minute");
//       }

//       const hours = Math.floor(time / 60);

//       return formatter.format(-hours, "hour");
//     }

//     const unit = (() => {
//       const minutesAgo = Math.floor(
//         (new Date().getTime() - date.getTime()) / (1000 * 60),
//       );

//       if (minutesAgo <= 60) {
//         return "minute";
//       }

//       if (daysAgo <= 1) {
//         return "hour";
//       }

//       if (daysAgo <= 30) {
//         return "day";
//       }

//       if (daysAgo <= 365) {
//         return "month";
//       }

//       return "year";
//     })();

//     const text = formatter.format(-daysAgo, unit);

//     return text.slice(0, 1).toUpperCase() + text.slice(1);
//   };

//   return (
//     <Popover modal open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button className="relative rounded-full" variant="ghost" size="icon">
//           <Bell className="size-4" />
//           <span
//             className={cn(
//               `absolute right-1 top-1 mt-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.65rem] text-white animate-in fade-in zoom-in`,
//               {
//                 hidden: !notifications.length,
//               },
//             )}
//           >
//             {notifications.length}
//           </span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         className="flex w-full max-w-96 flex-col p-0 lg:min-w-64"
//         align="start"
//         collisionPadding={20}
//         sideOffset={10}
//       >
//         <If condition={!notifications.length}>
//           <div className="px-3 py-2 text-sm">No notifications</div>
//         </If>
//         <div className="flex max-h-[60vh] flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
//           {notifications.map((notification) => {
//             const maxChars = 100;

//             let body = notification.body;

//             if (body.length > maxChars) {
//               body = body.substring(0, maxChars) + "...";
//             }

//             const Icon = () => {
//               switch (notification.type) {
//                 case "warning":
//                   return <TriangleAlert className="h-4 text-yellow-500" />;
//                 case "error":
//                   return <CircleAlert className="h-4 text-destructive" />;
//                 default:
//                   return <Info className="h-4 text-blue-500" />;
//               }
//             };

//             return (
//               <div
//                 key={notification.id.toString()}
//                 className={cn(
//                   "min-h-18 flex flex-col items-start justify-center space-y-0.5 px-3 py-2",
//                 )}
//               >
//                 <div className="flex w-full items-start justify-between">
//                   <div className="flex items-start justify-start space-x-2 py-2">
//                     <div className="py-0.5">
//                       <Icon />
//                     </div>
//                     <div className="flex flex-col space-y-1">
//                       <div className="text-sm">
//                         <If condition={notification.link} fallback={body}>
//                           {(link) => (
//                             <a href={link} className="hover:underline">
//                               {body}
//                             </a>
//                           )}
//                         </If>
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {timeAgo(notification.createdAt)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="py-2">
//                     <Button
//                       className="max-h-6 max-w-6"
//                       size="icon"
//                       variant="ghost"
//                       onClick={() =>
//                         dismissNotification.mutateAsync(
//                           {
//                             notification: notification.id,
//                           },
//                           {
//                             onSuccess: () => refetch(),
//                           },
//                         )
//                       }
//                     >
//                       <XIcon className="h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };
