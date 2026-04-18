import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';


@Module({
  imports: [
    PrismaModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Transcendence Bot" <${configService.get<string>('SMTP_USER')}>`,
        },
      }),
    }),
  ],
  controllers: [NotificationsController],
  exports: [NotificationsGateway, NotificationsService],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}