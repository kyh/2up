import {
  CircleHelpIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

export const getTeamAccountPageLinks = (account: string) =>
  [
    {
      id: "crud",
      href: createPath("/home/[account]", account),
      label: "CRUD",
      Icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      id: "members",
      href: createPath("/home/[account]/members", account),
      label: "Members",
      Icon: UsersIcon,
    },
    {
      id: "settings",
      href: createPath("/home/[account]/settings", account),
      label: "Settings",
      Icon: SettingsIcon,
    },
  ] as const;

function createPath(path: string, account: string) {
  return path.replace("[account]", account);
}
