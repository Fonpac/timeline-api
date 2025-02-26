import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { Request, ContextData } from './types'

interface PayloadData {
    id: number
    name: string
    email: string
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()])

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('No authorization token found')
        }

        try {
            const decoded = await this.decodeAuthToken(token)

            const contextData: ContextData = {
                userId: decoded.id.toString(),
            }

            // Extract projectId from request params
            const projectId = parseInt(request.params.projectId)

            if (!isNaN(projectId)) {
                if (await this.isMasterAccount(decoded.id, projectId)) {
                    contextData.permission = 'owner'
                } else if (await this.isSupportAccount(decoded.id, projectId)) {
                    contextData.permission = 'support'
                } else {
                    const memberPermission = await this.prisma.member.findFirst({
                        where: {
                            project_id: projectId,
                            user_id: decoded.id,
                        },
                        select: {
                            permission: true,
                            can_edit_timeline: true,
                        },
                    })

                    if (!memberPermission) {
                        throw new UnauthorizedException('User does not have access to this project')
                    }

                    contextData.permission = memberPermission.permission
                    contextData.canEditTimeline = memberPermission.can_edit_timeline
                }
            }

            // Add user and permissions to request object
            request.user = contextData

            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid token or insufficient permissions')
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }

    private async decodeAuthToken(token: string): Promise<PayloadData> {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            })

            return decoded as PayloadData
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    private async isMasterAccount(userId: number, projectId: number): Promise<boolean> {
        // Find the project first to get its client_id
        const project = await this.prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                client_id: true,
            },
        })

        if (!project) return false

        // Check if user is a master account for this client
        const result = await this.prisma.master_account.findFirst({
            where: {
                user_id: userId,
                client_id: project.client_id,
            },
        })

        return result !== null
    }

    private async isSupportAccount(userId: number, projectId: number): Promise<boolean> {
        const result = await this.prisma.support_session.findFirst({
            where: {
                user_id: userId,
                project_id: projectId,
                end_date: null,
            },
        })

        return result !== null
    }
}
