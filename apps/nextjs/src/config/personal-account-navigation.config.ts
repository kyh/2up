import { CreditCardIcon, HomeIcon, SettingsIcon } from "lucide-react";

export const getPersonalAccountPageLinks = () =>
  [
    {
      id: "teams",
      href: "/dashboard",
      label: "Teams",
      Icon: HomeIcon,
      exact: true,
    },
    {
      id: "billing",
      href: "/dashboard/billing",
      label: "Billing",
      Icon: CreditCardIcon,
    },
    {
      id: "settings",
      href: "/dashboard/settings",
      label: "Settings",
      Icon: SettingsIcon,
    },
  ] as const;
