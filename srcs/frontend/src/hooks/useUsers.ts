import { useState, useEffect } from 'react';
import { userService } from '../api/services';
import type { User } from '../../../../shared/srcs/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading };
}