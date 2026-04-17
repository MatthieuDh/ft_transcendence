import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // Voor je test staat deze nu op EVERY_MINUTE
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Running automated deadline check for both Tasks and Projects...');

    const now = new Date();

    // ==========================================
    // 1. CHECK ALLE TE LATE TAKEN
    // ==========================================
    const overdueTasks = await this.prisma.task.findMany({
      where: {
        deadline: { lt: now },
        status: { notIn: ['DONE'] }, 
        deadlineNotified: false,
      },
      include: {
        assignees: true,
        project: {
          include: {
            members: {
              where: { role: 'PROJECT_LEADER' },
              include: { user: true },
            },
          },
        },
      },
    });

    for (const task of overdueTasks) {
      const projectLeader = task.project?.members[0]?.user;
      const recipients = new Set<string>();

      if (projectLeader?.email) {
        recipients.add(projectLeader.email);
      }

      task.assignees.forEach((user) => {
        if (user.email) recipients.add(user.email);
      });

      for (const email of recipients) {
        await this.sendTaskEmail(email, task, projectLeader?.username);
      }

      await this.prisma.task.update({
        where: { id: task.id },
        data: { deadlineNotified: true },
      });
    }

    // ==========================================
    // 2. CHECK ALLE TE LATE PROJECTEN
    // ==========================================
    // ==========================================
    // 2. CHECK ALLE TE LATE PROJECTEN
    // ==========================================
    const overdueProjects = await this.prisma.project.findMany({
      
      // 1. DIT IS HET PROJECT FILTER (Hier hoort status!)
      where: { 
        deadline: { lt: now },
        deadlineNotified: false,
        status: { notIn: ['DONE', 'OK'] }, 
      },
      
      // 2. DIT IS DE GEKOPPELDE DATA (Hier hoort members!)
      include: { 
        members: {
          where: { role: 'PROJECT_LEADER' },
          include: { user: true },
        },
      },
      
    });
    for (const project of overdueProjects) {
      // Zoek de projectleider op
      const projectLeader = project.members[0]?.user;

      if (projectLeader?.email) {
        await this.sendProjectEmail(projectLeader.email, project, projectLeader.username);
      }

      await this.prisma.project.update({
        where: { id: project.id },
        data: { deadlineNotified: true },
      });
    }
  }

  private async sendTaskEmail(email: string, task: any, leaderName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `⚠️ URGENT: Task Deadline Missed - ${task.title}`,
        text: `The deadline for task "${task.title}" has passed.`,
        html: `
          <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #d32f2f;">🚨 Task Deadline Notification</h2>
            <p>This is an automated alert regarding the project: <strong>${task.project?.name || 'Unknown'}</strong>.</p>
            <p>The following task has exceeded its deadline without being marked as <b>DONE</b>:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 5px solid #d32f2f; margin: 20px 0;">
              <strong>Task Name:</strong> ${task.title}<br>
              <strong>Deadline:</strong> ${task.deadline.toLocaleDateString('en-GB')}<br>
              <strong>Status:</strong> <span style="color: #d32f2f;">${task.status}</span><br>
              <strong>Project Manager:</strong> ${leaderName || 'Not assigned'}
            </div>
            <p>Please take immediate action to update the status.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">This is a system-generated message from the Transcendence Platform.</p>
          </div>
        `,
      });
      this.logger.log(`Task email sent to ${email} for task ${task.id}`);
    } catch (error) {
      this.logger.error(`Error sending task email to ${email}: ${error.message}`);
    }
  }

  // --- MAIL TEMPLATE VOOR PROJECTEN ---
  private async sendProjectEmail(email: string, project: any, leaderName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `⚠️ CRITICAL: Project Deadline Missed - ${project.name}`,
        text: `The deadline for the entire project "${project.name}" has passed.`,
        html: `
          <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #B71C1C;">🛑 CRITICAL: Project Deadline Missed</h2>
            <p>Dear <strong>${leaderName}</strong>,</p>
            <p>This is an automated alert to inform you that an entire project you are managing has exceeded its final deadline:</p>
            <div style="background-color: #ffebee; padding: 15px; border-left: 5px solid #B71C1C; margin: 20px 0;">
              <strong>Project Name:</strong> ${project.name}<br>
              <strong>Final Deadline:</strong> ${project.deadline.toLocaleDateString('en-GB')}<br>
            </div>
            <p>Please review the project status and outstanding tasks immediately.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">This is a system-generated message from the Transcendence Platform.</p>
          </div>
        `,
      });
      this.logger.log(`Project email sent to ${email} for project ${project.id}`);
    } catch (error) {
      this.logger.error(`Error sending project email to ${email}: ${error.message}`);
    }
  }
}