import { useState,  } from "react";
import { useProfile } from "./useProfile";
import { useFriend } from "./useFriend";
import { useSentRequests } from "./useFriend";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useProfilePage(userId: number) {
  const { user } = useProfile(userId);
  const { friends } = useFriend(userId);
  const { currentUser, isLoading: authLoading } = useAuth();
  const { friends: myFriends, isLoading: friendsLoading, refetch: refetchMyFriends } = useFriend(currentUser?.id ?? 0);
  const { sentRequests, refetch: refetchSentRequests } = useSentRequests();
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => { setLocalUser(user); }, [user]);

  const isOwnProfile = currentUser?.id === userId;
  const isFriend = myFriends.some(f => f.id === userId);
  const isPending = sentRequests.some(r => r.addresseeId === userId);
  const friendship = myFriends.find(f => f.id === userId);

  return {
    localUser, setLocalUser,
    friends,
    currentUser,
    authLoading,
    friendsLoading,
    isOwnProfile,
    isFriend,
    isPending,
    friendship,
    refetchMyFriends,
    refetchSentRequests,
  };
}