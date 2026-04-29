export interface Notification{
    id: number;
    userId: number;
    type: string;
    isRead: boolean;
    message: string;
    createdAt: Date;
}