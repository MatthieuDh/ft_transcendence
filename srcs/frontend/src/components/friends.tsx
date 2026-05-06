import { Avatar, Card, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import type { FriendUser } from "@transcendence/shared";
import { useOnlineUsers } from "../hooks/useOnlineUsers";
import { useNavigate } from "react-router-dom";

function FriendList({ friends }: { friends: FriendUser[]; currentUserId: number }) {
  const onlineUserIds = useOnlineUsers();
  const navigate = useNavigate();

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="sm">Friends</Heading>
      </Card.Header>
      <Card.Body>
        {friends.length > 0 ? (
          <VStack align="stretch">
            {friends.map(friend => {
              const isOnline = onlineUserIds.has(friend.id);
              return (
                <HStack 
                key={friend.id} 
                opacity={isOnline ? 1 : 0.4}
                cursor="pointer"
                onClick={() => navigate(`/profile/${friend.id}`)}
                >
                  <Avatar.Root size="sm">
                    <Avatar.Fallback>{friend.username.charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar.Root>
                  <Text 
                  color={isOnline ? undefined : "fg.muted"}
                  _hover={{textDecoration: "underline"}}>
                    {friend.username}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        ) : (
          <Text color="fg.muted">No friends yet</Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default FriendList;