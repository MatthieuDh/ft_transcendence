import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Profile from "../components/profile";
import FriendList from "../components/friends";
import { useFriend } from "../hooks/useFriend";
import { HStack, Box, Container, VStack } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import AddFriendButton from "../components/addFriendButton";

export function ProfilePage() {
  const { userId } = useParams();
  const { user } = useProfile(Number(userId));
  const { friends } = useFriend(Number(userId));
  const { currentUser, isLoading: authLoading } = useAuth();

  const isOwnProfile = currentUser?.id === Number(userId);

  if (!user || authLoading) return <p>Loading...</p>;

  return (
    <Container maxW="1200px" mt={8}>
      <HStack gap={4} align="start">
        <Box flex={2}><Profile user={user} /></Box>
        <VStack>
          <Box flex={1}>
            <FriendList friends={friends} />
          </Box>
          {!isOwnProfile && (
            <AddFriendButton targetUserId={Number(userId)} />
          )}
        </VStack>
      </HStack>
    </Container>
  );
}

export default ProfilePage;
