import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggingService } from './logging.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly loggingService: LoggingService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const message = exception instanceof HttpException ? exception.message : 'Internal server error'

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        }

        // Get the stack trace if available
        const stack = exception instanceof Error ? exception.stack : undefined

        // Include more details in the log message for better readability in development mode
        const requestId = request['requestId'] || 'unknown'
        const logMessage = `Exception: [${status}] ${message} - ${request.method} ${request.url} (RequestID: ${requestId})`

        // Log the error with context and metadata
        this.loggingService.error(logMessage, stack, 'ExceptionFilter', {
            statusCode: status,
            path: request.url,
            method: request.method,
            requestId,
            body: this.sanitizeRequestBody(request.body),
            query: request.query,
            params: request.params,
        })

        response.status(status).json(errorResponse)
    }

    // Helper method to sanitize sensitive data from request body
    private sanitizeRequestBody(body: any): any {
        if (!body) return {}

        const sanitized = { ...body }

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'authorization']
        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]'
            }
        })

        return sanitized
    }
}
