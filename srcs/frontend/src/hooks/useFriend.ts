import { friendService } from "../api/services";
import type { FriendUser } from "../../../../shared/srcs/types";
import { useEffect, useState } from "react";

export function useFriend(userId: number) {
  const [friends, setFriends] = useState<FriendUser[]>([]);

  useEffect(() => {
    friendService.getMyFriends().then(response => {
      setFriends(response.data);
    }).catch(() => {});
  }, [userId]);

  return { friends };
}

export function useAddFriend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (userId: number) => {
    setIsLoading(true);
    try {
      await friendService.sendRequest(userId);
    } catch {
      setError('Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading, error };
}
