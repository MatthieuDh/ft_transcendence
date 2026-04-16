import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. check which roles are required by the route handler (controller method)
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // ik there are no required roles, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. we check for the presence of the user and if their role is included in the required roles
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Nice try, but you do not have permission to do this!');
    }

    return true; // we allow access if the user has one of the required roles
  }
}