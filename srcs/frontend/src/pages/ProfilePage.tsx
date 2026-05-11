import { useParams, useNavigate } from "react-router-dom";
import Profile from "../components/profile";
import FriendList from "../components/friends";
import { HStack, Box, Container, VStack, Flex, Spinner, Heading, Text, Button } from "@chakra-ui/react";
import AddFriendButton from "../components/addFriendButton";
import RemoveFriendButton from "../components/removeFriendButton";
import RoleSelect from "../components/roleSelection";
import type { GlobalRole } from "@transcendence/shared";
import { useProfilePage } from "../hooks/useProfilePage";
import EditProfileModal from "../components/editProfileModal";
import { LuUserX, LuArrowLeft } from "react-icons/lu";

export function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    localUser, setLocalUser,
    friends, currentUser, setCurrentUser,
    authLoading, friendsLoading, profileLoading,
    isOwnProfile, isFriend, isPending,
    friendship, refetchMyFriends, refetchSentRequests,
  } = useProfilePage(Number(userId));

  if (authLoading || profileLoading) {
    return (
      <Flex h="80vh" align="center" justify="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!localUser) {
    return (
      <Flex h="80vh" align="center" justify="center" direction="column" gap={4}>
        <Box p={6} bg="gray.100" _dark={{ bg: "gray.800" }} borderRadius="full">
          <LuUserX size={64} color="gray.400" />
        </Box>
        <Heading size="lg">User Not Found</Heading>
        <Text color="gray.500">The profile you are looking for does not exist or has been deleted.</Text>
        <Button mt={4} colorPalette="purple" onClick={() => navigate(-1)}>
          <LuArrowLeft /> Go Back
        </Button>
      </Flex>
    );
  }

  return (
    <Container maxW="1400px" mt={8}>
      <HStack gap={4} align="start" flexWrap="wrap">
        <Box flex="3 1 62%" minW="60%">
          <Profile user={localUser} 
            roleSelect={
              currentUser?.globalRole === 'ADMIN' && !isOwnProfile
                ? <RoleSelect
                    targetUserId={Number(userId)}
                    currentRole={localUser.globalRole as GlobalRole}
                    onSuccess={(newRole) => {
                      setLocalUser(prev => prev ? { ...prev, globalRole: newRole } : prev);
                    }}
                  />
                : undefined
            }
            editProfileButton={
              isOwnProfile
                ? <EditProfileModal
                    user={localUser}
                    onSuccess={(updatedUser) => { 
                      setLocalUser(updatedUser); 
                      if (currentUser?.id === updatedUser.id) {
                        setCurrentUser(updatedUser);
                      }
                    }}
                  />
                : undefined
            }
        />
        </Box>
        <VStack flex="1" gap={4}>
          <Box flex="2 1 38%" minW="300px" width="100%">
            <FriendList friends={friends} currentUserId={currentUser?.id ?? 0} />
          </Box>
          {!isOwnProfile && !friendsLoading && (
            isFriend
              ? <RemoveFriendButton friendshipId={friendship!.friendshipId} onSuccess={refetchMyFriends} />
              : <AddFriendButton 
                targetUserId={Number(userId)} 
                isPending={isPending} 
                onSuccess={() => {
                  refetchMyFriends(); 
                  refetchSentRequests();
                }} />
          )}
        </VStack>
      </HStack>
    </Container>
  );
}