import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name)

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        })
    }

    async onModuleInit() {
        try {
            await this.$connect()
            this.logger.log('Successfully connected to the database')
        } catch (error) {
            this.logger.error(`Failed to connect to the database: ${error.message}`)
            throw error
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect()
            this.logger.log('Successfully disconnected from the database')
        } catch (error) {
            this.logger.error(`Error disconnecting from the database: ${error.message}`)
        }
    }
}
