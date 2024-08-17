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

type Task = RouterOutputs["task"]["getTaskList"]["data"][0];

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export const getStatusIcon = (status: Task["status"]) => {
  const statusIcons = {
    canceled: CircleXIcon,
    done: CircleCheckIcon,
    "in-progress": Clock10Icon,
    todo: CircleHelpIcon,
  };

  return statusIcons[status];
};

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export const getPriorityIcon = (priority: Task["priority"]) => {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

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
