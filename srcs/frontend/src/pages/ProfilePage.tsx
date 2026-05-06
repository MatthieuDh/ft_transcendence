import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Profile from "../components/profile";
import { useFriend } from "../hooks/useFriend";
import FriendList from "../components/friends";
import { HStack, Box, Container, VStack  } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import AddFriendButton from "../components/addFriendButton";
import RemoveFriendButton from "../components/removeFriendButton";

export function ProfilePage() {
  const { userId } = useParams();
  const { user } = useProfile(Number(userId));
  const { friends } = useFriend(Number(userId));
  const { currentUser, isLoading: authLoading } = useAuth();
  const { friends: myFriends, isLoading: friendsLoading, refetch: refetchMyFriends } = useFriend(currentUser?.id ?? 0);
  

  const isOwnProfile = currentUser?.id === Number(userId);
  const isFriend = myFriends.some(f => f.id === Number(userId));
  const friendship = myFriends.find(f => f.id === Number(userId));

  if (!user || authLoading) return <p>Loading...</p>;

  return (
    <Container maxW="1400px" mt={8}>
      <HStack gap={4} align="start">
        <Box flex={3} borderRadius="xl" borderWidth="2px"><Profile user={user} /></Box>
        <VStack flex={2} gap={4}>
          <Box w="100%" borderRadius="xl">
            <FriendList friends={friends} currentUserId={currentUser?.id ?? 0} />
          </Box>
          {!isOwnProfile && !friendsLoading && (
            isFriend
              ? <RemoveFriendButton friendshipId={friendship!.friendshipId} onSuccess={refetchMyFriends} />
              : <AddFriendButton targetUserId={Number(userId)} onSuccess={refetchMyFriends}/>
          )}
        </VStack>
      </HStack>
    </Container>
  );
}