import { Box, Button, Input, VStack, Text, Heading, Dialog } from "@chakra-ui/react";
import { useState } from "react";
import { userService } from "../api/services";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(details) => {
      if (!details.open) reset();
      onOpenChange(details.open);
    }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Heading size="md">Change Password</Heading>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" mb={1}>Current Password</Text>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>New Password</Text>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>Confirm New Password</Text>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </Box>
              {error && <Text color="red.500" fontSize="sm">{error}</Text>}
              {success && <Text color="green.500" fontSize="sm">Password changed successfully!</Text>}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.CloseTrigger>
            <Button onClick={handleSubmit} loading={isLoading}>
              Change Password
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default ChangePasswordModal;