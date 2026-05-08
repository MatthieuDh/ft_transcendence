import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";
import { useFriend, useSentRequests } from "./useFriend";
import { useAuth } from "../context/AuthContext";

export function useProfilePage(userId: number) {
  const { user } = useProfile(userId);
  const { friends } = useFriend(userId);
  const { currentUser, setCurrentUser, isLoading: authLoading } = useAuth();
  const { friends: myFriends, isLoading: friendsLoading, refetch: refetchMyFriends } = useFriend(currentUser?.id ?? 0);
  const { sentRequests, refetch: refetchSentRequests } = useSentRequests();
  
  const [localUser, setLocalUser] = useState(user);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => { 
    setLocalUser(user); 
    
    if (user) {
      setProfileLoading(false);
    } else {
      const timer = setTimeout(() => setProfileLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const isOwnProfile = currentUser?.id === userId;
  const isFriend = myFriends.some(f => f.id === userId);
  const isPending = sentRequests.some(r => r.addresseeId === userId);
  const friendship = myFriends.find(f => f.id === userId);

  return {
    localUser, setLocalUser,
    friends,
    currentUser,
    setCurrentUser,
    authLoading,
    friendsLoading,
    profileLoading,
    isOwnProfile,
    isFriend,
    isPending,
    friendship,
    refetchMyFriends,
    refetchSentRequests,
  };
}