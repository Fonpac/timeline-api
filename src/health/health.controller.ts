import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HealthService } from './health.service'
import { HealthCheckResult } from './interfaces/health-check-result.interface'
import { Public } from '../auth/public.decorator'

@ApiTags('Saúde')
@Controller()
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Endpoint de verificação de saúde raiz' })
    @ApiResponse({
        status: 200,
        description: 'Aplicação está saudável',
        schema: {
            example: {
                status: 'ok',
                timestamp: '2023-02-26T12:34:56.789Z',
                uptime: '1h 23m 45s',
                version: '1.0.0',
                environment: 'development',
                hostname: 'server-name',
            },
        },
    })
    async root(): Promise<HealthCheckResult> {
        return this.healthService.check()
    }

    @Public()
    @Get('health')
    @ApiOperation({ summary: 'Endpoint de verificação de saúde detalhada' })
    @ApiResponse({
        status: 200,
        description: 'Aplicação está saudável',
        schema: {
            example: {
                status: 'ok',
                timestamp: '2023-02-26T12:34:56.789Z',
                uptime: '1h 23m 45s',
                version: '1.0.0',
                environment: 'development',
                hostname: 'server-name',
                services: {
                    mysql: 'ok',
                    mongodb: 'ok',
                },
            },
        },
    })
    async check(): Promise<HealthCheckResult> {
        return this.healthService.check(true)
    }
}
