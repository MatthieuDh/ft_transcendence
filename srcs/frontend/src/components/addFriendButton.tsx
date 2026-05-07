import { Button, Tooltip } from "@chakra-ui/react";
import { useAddFriend } from "../hooks/useFriend";

interface AddFriendButtonProps {
  targetUserId: number;
  onSuccess: () => void;
  isPending?: boolean;
}

function AddFriendButton({ targetUserId, onSuccess, isPending = false }: AddFriendButtonProps) {
  const { sendRequest, isLoading } = useAddFriend();

  if (isPending) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button disabled opacity={0.6} cursor="not-allowed">
            Request Sent
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Waiting for them to accept your friend request
        </Tooltip.Content>
      </Tooltip.Root>
    );
  }

  return (
    <Button
      onClick={async () => { await sendRequest(targetUserId); onSuccess(); }}
      loading={isLoading}
    >
      Add Friend
    </Button>
  );
}

export default AddFriendButton;