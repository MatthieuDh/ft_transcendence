import { useState } from 'react';
import { Box, VStack, Text, Input, Textarea, Button } from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger
} from './ui/dialog';
import { projectService } from '../api/services';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await projectService.create({
        name,
        description: desc || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined
      });

      setName('');
      setDesc('');
      setDeadline('');

      onCreated();
      onClose();
    } catch (e) {
      console.error("Error while creating the project:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center" motionPreset="scale">
      <DialogContent _dark={{ bg: "gray.800" }} position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" margin="0">
        <DialogHeader>
          <DialogTitle textAlign="left">Create New Project</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody pb={6}>
          <VStack align="stretch" gap={4} textAlign="left">
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Project Name *</Text>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Website Redesign"
                bg="white"
                borderWidth="1px"
                borderColor="gray.300"
                _dark={{ bg: "gray.700", borderColor: "gray.500" }}
                _hover={{ borderColor: "purple.400" }}
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Description</Text>
              <Textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={3}
                placeholder="What is this project about?"
                bg="white"
                borderWidth="1px"
                borderColor="gray.300"
                _dark={{ bg: "gray.700", borderColor: "gray.500" }}
                _hover={{ borderColor: "purple.400" }}
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Deadline</Text>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                bg="white"
                borderWidth="1px"
                borderColor="gray.300"
                _dark={{ bg: "gray.700", borderColor: "gray.500" }}
                _hover={{ borderColor: "purple.400" }}
              />
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorPalette="purple"
            onClick={handleSave}
            loading={isSubmitting}
            disabled={!name.trim()}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
