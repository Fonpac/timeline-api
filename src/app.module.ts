import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TimelinesModule } from './timelines/timelines.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { LoggingModule } from './logging/logging.module'
import { RequestLoggerMiddleware } from './logging/request-logger.middleware'
import * as fs from 'fs'
import * as path from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: async () => {
                let mongoUrl = process.env.MONGODB_URI
                mongoUrl += '?authMechanism=SCRAM-SHA-1'
                mongoUrl += `&authSource=${process.env.MONGODB_DB}`
                mongoUrl += '&tls=true'
                mongoUrl += '&replicaSet=rs0'
                mongoUrl += '&readPreference=secondaryPreferred'
                mongoUrl += '&retryWrites=false'

                // Verificar se o arquivo key.pem existe
                const keyPath = path.resolve('key.pem')
                const tlsCAFile = fs.existsSync(keyPath) ? keyPath : undefined

                return {
                    uri: mongoUrl,
                    ...(tlsCAFile ? { tlsCAFile } : {}),
                }
            },
        }),
        LoggingModule,
        PrismaModule,
        AuthModule,
        TimelinesModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply the request logger middleware to all routes
        consumer.apply(RequestLoggerMiddleware).forRoutes('*')
    }
}
