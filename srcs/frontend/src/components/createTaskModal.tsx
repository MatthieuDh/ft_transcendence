import { useState } from 'react';
import { Button, Input, Textarea, VStack, Text } from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from './ui/dialog';
import { taskService } from '../api/services';
import { TaskStatus } from '../../../../shared/srcs/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  initialStatus: TaskStatus;
  onSuccess: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, projectId, initialStatus, onSuccess }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await taskService.create({
        title,
        description: description || undefined,
        status: initialStatus,
        projectId,
        deadline: deadline ? new Date(deadline) : undefined,
        assigneeIds: [],
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} placement="center">
      <DialogContent _dark={{ bg: "gray.800" }}>
        <DialogHeader>
          <DialogTitle>Create New Task ({initialStatus.replace('_', ' ')})</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap={4} align="stretch">
            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="bold">Title *</Text>
              <Input 
                placeholder="Task title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                _dark={{ borderColor: "gray.600" }}
              />
            </VStack>

            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="bold">Description</Text>
              <Textarea 
                placeholder="Add more details to this task..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={4}
                _dark={{ borderColor: "gray.600" }}
              />
            </VStack>

            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="bold">Deadline</Text>
              <Input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                _dark={{ borderColor: "gray.600" }}
              />
            </VStack>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorPalette="purple" onClick={handleSave} loading={isSubmitting} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}