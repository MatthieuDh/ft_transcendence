import { useParams } from "react-router-dom";
import Profile from "../components/profile";
import FriendList from "../components/friends";
import { HStack, Box, Container, VStack  } from "@chakra-ui/react";
import AddFriendButton from "../components/addFriendButton";
import RemoveFriendButton from "../components/removeFriendButton";
import RoleSelect from "../components/roleSelection";
import type { GlobalRole } from "@transcendence/shared";
import { useProfilePage } from "../hooks/useProfilePage";
import EditProfileModal from "../components/editProfileModal";

export function ProfilePage() {
  const { userId } = useParams();
  const {
    localUser, setLocalUser,
    friends, currentUser, setCurrentUser,
    authLoading, friendsLoading,
    isOwnProfile, isFriend, isPending,
    friendship, refetchMyFriends, refetchSentRequests,
  } = useProfilePage(Number(userId));

  if (!localUser || authLoading) return <p>Loading...</p>;

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
                    onSuccess={() => {}}
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