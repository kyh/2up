import { cn } from "@2up/ui/utils";

export function Divider(props: { className?: string }) {
  return <div className={cn("bg-border h-[1px] w-full", props.className)} />;
}
