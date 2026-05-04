import { useEffect, useState } from "react";
import { userService } from "../api/services";
import type { User } from "../../../../shared/srcs/types";

export function useProfile(userId: number) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    userService.getUser(userId).then(response => {
      setUser(response.data);
    }).catch(() => {});
  }, [userId]);

  return { user };
}
