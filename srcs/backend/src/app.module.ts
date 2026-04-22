import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Import staat hier goed
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule, 
    AuthModule, 
    ProjectsModule, 
    TasksModule, 
    ScheduleModule.forRoot(), 
    NotificationsModule, DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
