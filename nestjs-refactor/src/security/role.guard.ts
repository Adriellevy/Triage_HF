import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if(!requiredRoles) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as {roles: string[]};

        if(!user || !user.roles) throw new UnauthorizedException('Token invalido');

        const hasRole = user.roles.some((role) => requiredRoles.includes(role));
        if(!hasRole) throw new ForbiddenException(`Acceso denegado: Se necesita ser ${requiredRoles.join(' o ')}`)
        return true;
    }
}