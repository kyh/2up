import {
  CircleDollarSignIcon,
  CircleHelpIcon,
  LayoutDashboardIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export const dashboardPageLinks = [
  { id: "crud", href: "/dashboard", label: "CRUD", Icon: LayoutDashboardIcon },
  { id: "team", href: "/team", label: "Team", Icon: UsersIcon },
  { id: "docs", href: "/docs", label: "Docs", Icon: CircleHelpIcon },
] as const;

export const accountPageLinks = [
  { id: "account", href: "/account", label: "Account", Icon: UserIcon },
  {
    id: "billing",
    href: "/account/billing",
    label: "Billing",
    Icon: CircleDollarSignIcon,
  },
] as const;
