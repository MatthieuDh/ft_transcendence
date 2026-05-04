import { useState } from 'react';
import { Flex, Button, IconButton } from '@chakra-ui/react';
import { LuUserPlus, LuX } from "react-icons/lu";
import { useAddMember } from '../hooks/useAddmember';
import type { ProjectMember } from '../../../../shared/srcs/types';

interface AddMemberMenuProps {
  projectId: number;
  existingMembers: ProjectMember[];
  onMemberAdded: () => void;
}

export default function AddMemberMenu({ projectId, existingMembers, onMemberAdded }: AddMemberMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const { availableUsers, isAdding, addMember } = useAddMember(projectId, existingMembers);

  const handleAdd = async () => {
    if (!selectedUserId) return;
    const success = await addMember(Number(selectedUserId));
    if (success) {
      setIsOpen(false);
      setSelectedUserId('');
      onMemberAdded();
    }
  };

  if (!isOpen) {
    return (
      <Button size="sm" variant="surface" colorPalette="purple" onClick={() => setIsOpen(true)}>
        <LuUserPlus /> Add Member
      </Button>
    );
  }

  return (
    <Flex bg="gray.50" p={3} borderRadius="md" border="1px solid" borderColor="gray.200" _dark={{ bg: "gray.900", borderColor: "gray.700" }} align="center" gap={2}>
      <select 
        value={selectedUserId} 
        onChange={(e) => setSelectedUserId(Number(e.target.value))}
        style={{ padding: '6px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ccc', outline: 'none' }}
      >
        <option value="">Select a user...</option>
        {availableUsers.map(u => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>
      <Button size="sm" colorPalette="purple" onClick={handleAdd} loading={isAdding} disabled={!selectedUserId}>
        Add
      </Button>
      <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="Cancel" onClick={() => setIsOpen(false)}>
        <LuX />
      </IconButton>
    </Flex>
  );
}
