import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as winston from 'winston'
import { LoggingService } from './logging.service'

@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const environment = configService.get('NODE_ENV') || 'development'

                // Use CloudWatch format for production and alpha environments
                const isCloudWatchEnabled = ['production', 'alpha'].includes(environment)

                // Format for CloudWatch Log Insights compatibility
                const cloudwatchFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                    // Convert metadata to a string if it exists
                    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : ''

                    // Format that works well with CloudWatch Log Insights
                    return JSON.stringify({
                        timestamp,
                        level,
                        message,
                        ...(meta ? { metadata: meta } : {}),
                    })
                })

                // Simple format for development - just show the message and basic info
                const simpleFormat = winston.format.printf(({ level, message, context, timestamp }) => {
                    const contextStr = context ? `[${context}] ` : ''
                    return `${timestamp} - ${level.toUpperCase()}: ${contextStr}${message}`
                })

                return {
                    transports: [
                        // Console transport for all environments
                        new winston.transports.Console({
                            format: winston.format.combine(
                                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                                isCloudWatchEnabled ? cloudwatchFormat : simpleFormat
                            ),
                            level: isCloudWatchEnabled ? 'info' : 'debug',
                        }),
                    ],
                }
            },
        }),
    ],
    providers: [LoggingService],
    exports: [LoggingService],
})
export class LoggingModule {}
