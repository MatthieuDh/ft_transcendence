import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IsBtcAddress } from 'class-validator';

@Injectable()
export class FriendsService {
constructor(
    private prisma: PrismaService,
    private  notificationsService: NotificationsService,
  ){}
async sendrequest(requesterId: number, addresseeId: number) {
    console.log('sendRequest called:', { requesterId, addresseeId });
    if (requesterId === addresseeId) {
      throw new BadRequestException('You cannot send a friend request to yourself.');
    }
const targetUser = await this.prisma.user.findUnique({ where: { id: addresseeId } });
    if (!targetUser) {
      throw new NotFoundException('The user you are trying to send a friend request to does not exist.');
    }
    const existingRequest = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });
    if (existingRequest) {
      throw new ConflictException('You have already sent a friend request to this user.');
    }
    const friendRequest = await this.prisma.friendship.create({
        data: {
            requesterId: requesterId,
            addresseeId: addresseeId,
            status: 'PENDING',
        },
    });
    const sender = await this.prisma.user.findUnique({ where: { id: requesterId } });
    if ( sender) {
    await this.notificationsService.createNotification(
      addresseeId,
      'friend_request',
      `${sender.username} has sent you a friend request!`,
    );
    return friendRequest;
  }
}
async acceptrequest(loggedInUserId: number, requesterId: number) {
    const friendRequest = await this.prisma.friendship.findFirst({
      where: {
        requesterId: requesterId,
        addresseeId: loggedInUserId,
        status: 'PENDING',
      },
    });
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found.');
    }
    return await this.prisma.friendship.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }
async rejectrequest(loggedInUserId: number, requesterId: number) {
    const friendRequest = await this.prisma.friendship.findFirst({
      where: {
        requesterId: requesterId,
        addresseeId: loggedInUserId,
        status: 'PENDING',
      },
    });
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found.');
    }
    return await this.prisma.friendship.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: 'REJECTED',
      },
    });
  }
async getfriends(userId: number) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: true,
        addressee: true,
      },
    });
    return friendships.map(friendship => {
      const friend = friendship.requesterId === userId ? friendship.addressee : friendship.requester;
      return {
        id: friend.id,
        username: friend.username,
        email: friend.email,
      };
    });
  }
  async getFriendRequests(userId: number) {
    return this.prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: 'PENDING', },
        include: {
            requester: {select: {id: true, username: true, email: true}}
        }
    });
  }

  async getSentRequests(requesterId: number) {
    return this.prisma.friendship.findMany({
      where: {
        requesterId: requesterId,
        status: 'PENDING', },
        select:{
          id: true,
          addresseeId: true,
          status: true,
        }
    });
  }


    async getMyFriends(userId: number) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      },
      include: {
        requester: { select: { id: true, username: true, avatar: true } },
        addressee: { select: { id: true, username: true, avatar: true } }
      }
    });
    return friendships.map(f => {
      const friend = f.requesterId === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        ...friend
      };
    });
  }
  async removefriendship(loggedInUserId: number, friendshipId: number) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!friendship) {
      throw new NotFoundException('Friendship not found.');
    }
    if (friendship.requesterId !== loggedInUserId && friendship.addresseeId !== loggedInUserId) {
      throw new BadRequestException('You can only remove friendships you are part of.');
    }
    return await this.prisma.friendship.delete({
       where: { id: friendshipId },
     });
    }
}