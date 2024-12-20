import { cn } from "@init/ui/utils";

export const Divider = (props: { className?: string }) => {
  return <div className={cn("bg-border h-[1px] w-full", props.className)} />;
}
