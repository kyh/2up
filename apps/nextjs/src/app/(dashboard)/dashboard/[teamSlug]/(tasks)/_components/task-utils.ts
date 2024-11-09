import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleXIcon,
  Clock10Icon,
} from "lucide-react";

import type { RouterOutputs } from "@init/api";

export type Task = NonNullable<RouterOutputs["task"]["getTask"]["task"]>;

const statusIcons = {
  canceled: CircleXIcon,
  done: CircleCheckIcon,
  "in-progress": Clock10Icon,
  todo: CircleHelpIcon,
};
export const getStatusIcon = (status: Task["status"]) => {
  return statusIcons[status];
};

const priorityIcons = {
  high: ArrowUpIcon,
  low: ArrowDownIcon,
  medium: ArrowRightIcon,
};
export const getPriorityIcon = (priority: Task["priority"]) => {
  return priorityIcons[priority];
};

export const formatDate = (
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) =>
  new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
