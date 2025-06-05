"use client";

import * as React from "react";
import { cn } from "@repo/ui/utils";
import { Avatar as AvatarPrimitive } from "radix-ui";

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root>;

export const Avatar = ({ className, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
);

type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
);

type AvatarFallbackProps = React.ComponentProps<
  typeof AvatarPrimitive.Fallback
>;

export const AvatarFallback = ({
  className,
  ...props
}: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className,
    )}
    {...props}
  />
);

type ProfileAvatarProps = {
  className?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

export const ProfileAvatar = ({
  className,
  displayName,
  avatarUrl,
}: ProfileAvatarProps) => {
  const initials = displayName?.slice(0, 1);

  return (
    <Avatar className={cn("size-9", className)}>
      <AvatarImage src={avatarUrl ?? undefined} />
      <AvatarFallback className="animate-in fade-in uppercase">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
