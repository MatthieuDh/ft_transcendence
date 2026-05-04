import { useState, useEffect } from 'react';
import { projectService, userService } from '../api/services';
import { ProjectRole } from '../../../../shared/srcs/types';
import type { User, ProjectMember } from '../../../../shared/srcs/types';

export function useAddMember(projectId: number, existingMembers: ProjectMember[] = []) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await userService.getAllUsers();
        const filtered = res.data.filter(user => 
          !existingMembers.some(member => member.userId === user.id)
        );
        setAvailableUsers(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [existingMembers]);

  const addMember = async (userId: number, role: ProjectRole = ProjectRole.MEMBER) => {
    setIsAdding(true);
    try {
      await projectService.addMember(projectId, userId, role);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return { availableUsers, isLoadingUsers, isAdding, addMember };
}