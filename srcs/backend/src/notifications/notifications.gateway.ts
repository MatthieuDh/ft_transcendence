import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<number, string[]>();

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.removeSocketId(client.id);
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('identify')
  handleIdentify(@ConnectedSocket() client: Socket, @MessageBody() userId: number) {
    const userSockets = this.connectedUsers.get(userId) || [];
    const isNewlyOnline = userSockets.length === 0;

    userSockets.push(client.id);
    this.connectedUsers.set(userId, userSockets);
    client.emit('identified', { status: 'success' });

    const currentlyOnline = Array.from(this.connectedUsers.keys());
    client.emit('initial_online_users', currentlyOnline);

    if (isNewlyOnline) {
      this.server.emit('user_status_change', { userId: userId, status: 'ONLINE' });
      this.logger.log(`User ${userId} is nu ONLINE.`);
    }
  }

  sendNotificationToUser(userId: number, payload: any) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit('new_notification', payload);
      });
    }
  }

  private removeSocketId(socketId: string) {
    for (const [userId, sockets] of this.connectedUsers.entries()) {
      const updatedSockets = sockets.filter((id) => id !== socketId);
      
      if (updatedSockets.length === 0) {
        this.connectedUsers.delete(userId);
        
        this.server.emit('user_status_change', { userId: userId, status: 'OFFLINE' });
        this.logger.log(`User ${userId} is nu zichtbaar als OFFLINE.`);
      } else {
        this.connectedUsers.set(userId, updatedSockets);
      }
    }
  }
  @SubscribeMessage('joined project')
  handleJoinedProject(@ConnectedSocket() client: Socket, @MessageBody() data: { username: string; projectId: number }) {
    const room = `project_${data.projectId}`;
    client.join(room);
    this.logger.log(`User ${data.username} joined room: ${room}`);
  }

  @SubscribeMessage('left project')
  handleLeftProject(@ConnectedSocket() client: Socket, @MessageBody() data: { username: string; projectId: number }) {
    const room = `project_${data.projectId}`;
    client.leave(room);
    this.logger.log(`User ${data.username} left room: ${room}`);
  }

  sendProjectNotification(projectId: number, message: any) {
    const room = `project_${projectId}`;
    this.server.to(room).emit('new_project_notification', message);
  }
}