import { Injectable, Optional } from '@nestjs/common'
import { HealthCheckResult } from './interfaces/health-check-result.interface'
import { PrismaService } from '../prisma/prisma.service'
import { LoggingService } from '../logging/logging.service'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import * as os from 'os'
import * as process from 'process'

@Injectable()
export class HealthService {
    private startTime: number

    constructor(
        private readonly prismaService: PrismaService,
        private readonly logger: LoggingService,
        @Optional() @InjectConnection() private readonly mongoConnection?: Connection
    ) {
        this.startTime = Date.now()
    }

    /**
     * Verifica a saúde da aplicação
     * @param detailed Se deve incluir verificações detalhadas de serviços
     * @returns Resultado da verificação de saúde
     */
    async check(detailed = false): Promise<HealthCheckResult> {
        const uptime = this.formatUptime(process.uptime())
        const packageJson = require('../../package.json')

        // Resultado básico da verificação de saúde
        const result: HealthCheckResult = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime,
            version: packageJson.version,
            environment: process.env.NODE_ENV || 'development',
            hostname: os.hostname(),
        }

        // Se detailed for true, verifica a saúde dos serviços
        if (detailed) {
            result.services = {}

            // Verifica a conexão MySQL (via Prisma)
            try {
                await this.checkMySqlConnection()
                result.services.mysql = 'ok'
            } catch (error) {
                this.logger.error('Falha na verificação de saúde do MySQL', error.stack, 'HealthService')
                result.services.mysql = 'error'
                result.status = 'degraded'
            }

            // Verifica a conexão MongoDB
            if (this.mongoConnection) {
                try {
                    await this.checkMongoConnection()
                    result.services.mongodb = 'ok'
                } catch (error) {
                    this.logger.error('Falha na verificação de saúde do MongoDB', error.stack, 'HealthService')
                    result.services.mongodb = 'error'
                    result.status = 'degraded'
                }
            } else {
                this.logger.warn('Conexão MongoDB não disponível para verificação de saúde', 'HealthService')
                result.services.mongodb = 'unknown'
            }

            // Adicione mais verificações de serviços conforme necessário
        }

        return result
    }

    /**
     * Verifica a conexão MySQL via Prisma
     */
    private async checkMySqlConnection(): Promise<void> {
        try {
            // Consulta simples para verificar se o banco de dados MySQL está respondendo
            await this.prismaService.$queryRaw`SELECT 1`
        } catch (error) {
            throw new Error(`Falha na conexão MySQL: ${error.message}`)
        }
    }

    /**
     * Verifica a conexão MongoDB
     */
    private async checkMongoConnection(): Promise<void> {
        if (!this.mongoConnection) {
            throw new Error('Conexão MongoDB não disponível')
        }

        try {
            // Verifica se a conexão MongoDB está pronta
            if (this.mongoConnection.readyState !== 1) {
                throw new Error('Conexão MongoDB não está pronta')
            }

            // Executa um comando simples para verificar se a conexão está funcionando
            await this.mongoConnection.db.admin().ping()
        } catch (error) {
            throw new Error(`Falha na conexão MongoDB: ${error.message}`)
        }
    }

    /**
     * Formata o tempo de atividade em um formato legível
     * @param uptime Tempo de atividade em segundos
     * @returns String formatada de tempo de atividade
     */
    private formatUptime(uptime: number): string {
        const days = Math.floor(uptime / 86400)
        const hours = Math.floor((uptime % 86400) / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)
        const seconds = Math.floor(uptime % 60)

        const parts = []
        if (days > 0) parts.push(`${days}d`)
        if (hours > 0) parts.push(`${hours}h`)
        if (minutes > 0) parts.push(`${minutes}m`)
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

        return parts.join(' ')
    }
}
