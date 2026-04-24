import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [PrismaModule, NotificationsModule]
})
export class CommentsModule {}
