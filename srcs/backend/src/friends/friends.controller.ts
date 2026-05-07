import { Controller, Post, Patch, Delete, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  getMyFriends(@Request() req) {
    return this.friendsService.getMyFriends(req.user.sub);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  getFriendsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.friendsService.getMyFriends(userId);
  }

  @Get('requests')
  getPendingRequests(@Request() req) {
    return this.friendsService.getFriendRequests(req.user.sub);
  }

  @Get('sent-requests')
  getSentRequests(@Request() req) {
  return this.friendsService.getSentRequests(req.user.sub);
}

  @Post('request/:userId')
  sendRequest(@Request() req, @Param('userId', ParseIntPipe) targetUserId: number) {
    console.log('friend request sent by:', req.user);
    console.log('to user:', targetUserId);
    return this.friendsService.sendrequest(req.user.sub, targetUserId);
  }

  @Patch('accept/:friendshipId')
  acceptRequest(@Request() req, @Param('friendshipId', ParseIntPipe) friendshipId: number) {
    return this.friendsService.acceptrequest(req.user.sub, friendshipId);
  }

  @Patch('reject/:friendshipId')
  rejectRequest(@Request() req, @Param('friendshipId', ParseIntPipe) friendshipId: number) {
    return this.friendsService.rejectrequest(req.user.sub, friendshipId);
  }

  @Delete('remove/:friendshipId')
  removeFriendship(@Request() req, @Param('friendshipId', ParseIntPipe) friendshipId: number) {
    return this.friendsService.removefriendship(req.user.sub, friendshipId);
  }
}