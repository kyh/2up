import { cn } from "@init/ui/utils";

export const Divider = (props: { className?: string }) => {
  return <div className={cn("h-[1px] w-full bg-border", props.className)} />;
};
