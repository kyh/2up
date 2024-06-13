import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@init/ui/select";

type Role = string;

export function MembershipRoleSelector({
  roles,
  value,
  currentUserRole,
  onChange,
}: {
  roles: Role[];
  value: Role;
  currentUserRole?: Role;
  onChange: (role: Role) => unknown;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger data-test={"role-selector-trigger"}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {roles.map((role) => {
          return (
            <SelectItem
              key={role}
              data-test={`role-option-${role}`}
              disabled={currentUserRole === role}
              value={role}
            >
              <span className={"text-sm capitalize"}>{role}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
