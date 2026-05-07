import { friendService } from "../api/services";
import{ type SentRequest } from "@transcendence/shared";
import { useEffect, useState, useCallback } from "react";
import type { FriendUser, FriendRequest } from "../../../../shared/srcs/types";

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
export function useFriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    friendService.getRequests().then(res => {
      setRequests(res.data.filter(req => req.status === 'PENDING'));
    }).catch(console.error);
  }, []);

  const accept = async (requesterId: number) => {
    try {
      await friendService.acceptRequest(requesterId);
      setRequests(prev => prev.filter(req => req.requesterId !== requesterId));
    } catch (error) {
      console.error(error);
    }
  };

  const reject = async (requesterId: number) => {
    try {
      await friendService.rejectRequest(requesterId);
      setRequests(prev => prev.filter(req => req.requesterId !== requesterId));
    } catch (error) {
      console.error(error);
    }
  };
  return { requests, accept, reject };
}
