import { useState } from "react";
import { userService } from "../api/services";

export function usePromote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promoteUser = async (userId: number) => {
    setIsLoading(true);
    try {
      await userService.promoteUser(userId);
    } catch (e) {
      setError('Failed to promote user');
    } finally {
      setIsLoading(false);
    }
  };

  return { promoteUser, isLoading, error };
}