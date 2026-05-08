import {
  Box, Button, Input, VStack, Text, Heading,
  Dialog, IconButton, Tooltip, Avatar
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { LuSettings } from "react-icons/lu";
import { userService } from "../api/services";
import type { User } from "@transcendence/shared/srcs/types/user";

interface EditProfileModalProps {
  user: User;
  onSuccess: (updatedUser: User) => void;
}

function EditProfileModal({ user, onSuccess }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.updateUser({
        username,
        email,
        avatar: avatar ?? undefined,
      });
      onSuccess(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Box display="inline-block">
            <Dialog.Trigger asChild>
              <IconButton aria-label="Edit profile" variant="ghost" size="sm">
                <LuSettings />
              </IconButton>
            </Dialog.Trigger>
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content>Edit profile</Tooltip.Content>
      </Tooltip.Root>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Heading size="md">Edit Profile</Heading>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={4} align="stretch">

              {/* Avatar upload */}
              <Box>
                <Text fontSize="sm" mb={2}>Avatar</Text>
                <VStack gap={2} align="start">
                  <Avatar.Root size="xl" cursor="pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar.Image src={avatar ?? undefined} />
                    <Avatar.Fallback>{username?.charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar.Root>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Upload Image
                  </Button>
                  {avatar && avatar !== user.avatar && (
                    <Text fontSize="xs" color="fg.muted">New avatar selected</Text>
                  )}
                </VStack>
              </Box>

              <Box>
                <Text fontSize="sm" mb={1}>Username</Text>
                <Input value={username} onChange={e => setUsername(e.target.value)} />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>Email</Text>
                <Input value={email} onChange={e => setEmail(e.target.value)} />
              </Box>
              {error && <Text color="red.500" fontSize="sm">{error}</Text>}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.CloseTrigger>
            <Button onClick={handleSubmit} loading={isLoading}>
              Save Changes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default EditProfileModal;