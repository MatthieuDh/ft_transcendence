import { Avatar, Card, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import type { FriendUser } from "../../../../shared/srcs/types";

function FriendList({ friends }: { friends: FriendUser[] }) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="sm">Friends</Heading>
      </Card.Header>
      <Card.Body>
        {friends.length > 0 ? (
          <VStack align="stretch">
            {friends.map(friend => (
              <HStack key={friend.id}>
                <Avatar.Root size="sm">
                  <Avatar.Fallback>{friend.username.charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar.Root>
                <Text>{friend.username}</Text>
              </HStack>
            ))}
          </VStack>
        ) : (
          <Text color="fg.muted">No friends yet</Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default FriendList;
