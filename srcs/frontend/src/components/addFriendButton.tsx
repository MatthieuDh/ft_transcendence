import { Button } from "@chakra-ui/react";
import { useAddFriend } from "../hooks/useFriend";

function AddFriendButton({ targetUserId }: { targetUserId: number }) {
  const { sendRequest, isLoading } = useAddFriend();

  return (
    <Button 
      onClick={() => sendRequest(targetUserId)}
      loading={isLoading}
    >
      Add Friend
    </Button>
  );
}

export default AddFriendButton;