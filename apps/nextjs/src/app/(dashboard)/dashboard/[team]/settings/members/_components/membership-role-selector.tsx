import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@init/ui/select";

type Role = string;

export const MembershipRoleSelector = ({
  roles,
  value,
  currentUserRole,
  onChange,
}: {
  roles: Role[];
  value: Role;
  currentUserRole?: Role;
  onChange: (role: Role) => unknown;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {roles.map((role) => {
        return (
          <SelectItem
            key={role}
            disabled={currentUserRole === role}
            value={role}
          >
            <span className="text-sm capitalize">{role}</span>
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);
