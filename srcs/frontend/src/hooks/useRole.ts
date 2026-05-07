import { useState } from "react";
import { userService } from "../api/services";
import { GlobalRole } from "@transcendence/shared/srcs/types/user";

export function useRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeRole = async (userId: number, newRole: GlobalRole) => {
    setIsLoading(true);
    setError(null);
    try {
      if (newRole === GlobalRole.ADMIN) {
        await userService.promoteUser(userId);
      } else {
        await userService.demoteUser(userId);
      }
    } catch (e) {
      setError(`Failed to ${newRole === GlobalRole.ADMIN ? 'promote' : 'demote'} user`);
    } finally {
      setIsLoading(false);
    }
  };

  return { changeRole, isLoading, error };
}