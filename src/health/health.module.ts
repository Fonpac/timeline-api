import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { PrismaModule } from '../prisma/prisma.module'
import { LoggingModule } from '../logging/logging.module'

@Module({
    imports: [PrismaModule, LoggingModule],
    controllers: [HealthController],
    providers: [HealthService],
    exports: [HealthService],
})
export class HealthModule {}
