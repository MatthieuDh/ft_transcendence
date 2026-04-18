import { Controller, Patch, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:id')
  async getNotifications(@Param('id', ParseIntPipe) userId: number) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch('user/:id/read')
  async markAsRead(@Param('id', ParseIntPipe) userId: number) {
    return this.notificationsService.markAllAsRead(userId);
  }
}