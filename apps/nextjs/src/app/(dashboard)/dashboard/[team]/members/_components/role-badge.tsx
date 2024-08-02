import { Badge } from "@init/ui/badge";
import { cva } from "class-variance-authority";

type Role = string;

const roles = {
  owner: "",
  member:
    "bg-blue-50 hover:bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:hover:bg-blue-500/10",
};

const roleClassNameBuilder = cva("font-medium capitalize shadow-none", {
  variants: {
    role: roles,
  },
});

export const RoleBadge = ({ role }: { role: Role }) => {
  // @ts-expect-error: hard to type this since users can add custom roles
  const className = roleClassNameBuilder({ role });
  const isCustom = !(role in roles);

  return (
    <Badge className={className} variant={isCustom ? "outline" : "default"}>
      <span>{role}</span>
    </Badge>
  );
};
