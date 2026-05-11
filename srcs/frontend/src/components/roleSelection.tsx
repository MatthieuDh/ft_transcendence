import { NativeSelect, Box, Text } from "@chakra-ui/react";
import { useRole } from "../hooks/useRole";
import { GlobalRole } from "@transcendence/shared/srcs/types/user";

interface RoleSelectProps {
  targetUserId: number;
  currentRole: GlobalRole;
  onSuccess?: (newRole: GlobalRole) => void;
}

function RoleSelect({ targetUserId, currentRole, onSuccess }: RoleSelectProps) {
  const { changeRole, isLoading, error } = useRole();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as GlobalRole;
    if (newRole === currentRole) return;
    await changeRole(targetUserId, newRole);
    onSuccess?.(newRole);
  };

  return (
    <Box>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={currentRole}
          onChange={handleChange}
          aria-disabled={isLoading}
          opacity={isLoading ? 0.6 : 1}
          pointerEvents={isLoading ? "none" : "auto"}
        >
          <option value={GlobalRole.USER}>User</option>
          <option value={GlobalRole.ADMIN}>Admin</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {error && <Text color="red.500" fontSize="sm" mt={1}>{error}</Text>}
    </Box>
  );
}

export default RoleSelect;