import { Button } from "@chakra-ui/react";
import { useAddFriend } from "../hooks/useFriend";

function AddFriendButton({ targetUserId, onSuccess }: { targetUserId: number, onSuccess:() => void }) {
  const { sendRequest, isLoading } = useAddFriend();

  return (
    <Button 
      onClick={async() => {await sendRequest(targetUserId); onSuccess();}}
      loading={isLoading}
    >
      Add Friend
    </Button>
  );
}

export default AddFriendButton;