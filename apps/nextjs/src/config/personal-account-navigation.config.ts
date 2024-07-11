import { CreditCardIcon, HomeIcon, SettingsIcon } from "lucide-react";

export const getPersonalAccountPageLinks = () =>
  [
    {
      id: "teams",
      href: "/home",
      label: "Teams",
      Icon: HomeIcon,
      exact: true,
    },
    {
      id: "billing",
      href: "/home/billing",
      label: "Billing",
      Icon: CreditCardIcon,
    },
    {
      id: "settings",
      href: "/home/settings",
      label: "Settings",
      Icon: SettingsIcon,
    },
  ] as const;
