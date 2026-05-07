import { friendService } from "../api/services";
import{ type FriendUser, type SentRequest } from "@transcendence/shared";
import { useEffect, useState, useCallback } from "react";

export function useFriend(userId: number) {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await friendService.getFriendsByUserId(userId);
      setFriends(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return { friends, isLoading, refetch: fetchFriends };
}

export function useAddFriend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sendRequest = async (userId: number) => {
    setIsLoading(true);
    try {
      await friendService.sendRequest(userId);
    } catch (e) {
      setError('Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading, error };
}

// useRemoveFriend hook — add this to useFriend.ts
export function useRemoveFriend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeFriend = async (friendshipId: number) => {
    setIsLoading(true);
    try {
      await friendService.removeFriend(friendshipId);
    } catch (e) {
      setError('Failed to remove friend');
    } finally {
      setIsLoading(false);
    }
  };

  return { removeFriend, isLoading, error };
}

export function useSentRequests() {
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSentRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await friendService.getSentRequests();
      setSentRequests(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  return { sentRequests, isLoading, refetch: fetchSentRequests };
}