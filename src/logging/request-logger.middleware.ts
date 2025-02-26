import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { LoggingService } from './logging.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(private readonly loggingService: LoggingService) {}

    use(req: Request, res: Response, next: NextFunction) {
        // Generate a unique request ID
        const requestId = uuidv4()
        req['requestId'] = requestId

        // Get the timestamp when the request started
        const startTime = Date.now()

        // Log the request - include IP in the message for development mode
        this.loggingService.log(`Incoming request: ${req.method} ${req.originalUrl} from ${req.ip}`, 'HTTP', {
            requestId,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent') || 'unknown',
        })

        // Add a listener for when the response is finished
        res.on('finish', () => {
            // Calculate the response time
            const responseTime = Date.now() - startTime

            // Log the response - include status code and response time in the message for development mode
            this.loggingService.log(`Response sent: ${req.method} ${req.originalUrl} ${res.statusCode} (${responseTime}ms)`, 'HTTP', {
                requestId,
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                responseTime: `${responseTime}ms`,
            })
        })

        next()
    }
}
