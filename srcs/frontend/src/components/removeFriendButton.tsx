import { Button } from "@chakra-ui/react";
import { useRemoveFriend } from "../hooks/useFriend";

function RemoveFriendButton({ friendshipId, onSuccess }: { friendshipId: number; onSuccess:() => void }) {
  const { removeFriend, isLoading } = useRemoveFriend();

  return (
    <Button
      onClick={async() => { await removeFriend(friendshipId), onSuccess();}}
      loading={isLoading}
      colorPalette="red"
    >
      Remove Friend
    </Button>
  );
}

export default RemoveFriendButton;