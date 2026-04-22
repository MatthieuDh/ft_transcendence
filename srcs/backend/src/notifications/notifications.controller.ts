import { Controller, Patch, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(
      createNotificationDto.userId,
      createNotificationDto.type,
      createNotificationDto.message
    );
  }

  @Get('user/:id')
  async getNotifications(@Param('id', ParseIntPipe) userId: number) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch('user/:id/read')
  async markAsRead(@Param('id', ParseIntPipe) userId: number) {
    return this.notificationsService.markAllAsRead(userId);
  }
}