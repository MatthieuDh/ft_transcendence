import { User } from "./user";

export enum FriendshipStatus{
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED'
}

export interface Friends{
    requester: User;
    addressee: User;
    status: FriendshipStatus;
}