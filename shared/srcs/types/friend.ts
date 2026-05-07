import type { User } from "./user";

export enum FriendshipStatus{
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED'
}

export interface Friend{
    friendshipId: number;
    requester: User;
    addressee: User;
    status: FriendshipStatus;
}

export interface SentRequest {
  id: number;
  addresseeId: number;
  status: 'PENDING';
}

export interface FriendUser {
  friendshipId: number;
  id: number;
  username: string;
  avatar?: string;
}

export interface FriendRequest {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: FriendshipStatus;
  requester: { id: number; username: string; email: string };
}