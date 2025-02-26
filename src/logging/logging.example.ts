import { Injectable } from '@nestjs/common'
import { LoggingService } from './logging.service'

/**
 * This is an example service that demonstrates how to use the LoggingService.
 * This file is for documentation purposes only and is not used in the application.
 */
@Injectable()
export class ExampleService {
    constructor(private readonly logger: LoggingService) {}

    /**
     * Example method that demonstrates different log levels
     */
    public demonstrateLogging() {
        // Basic logging
        this.logger.log('This is an info message', 'ExampleService')

        // Logging with metadata
        this.logger.log('This is an info message with metadata', 'ExampleService', { userId: '123', action: 'demonstrateLogging' })

        // Different log levels
        this.logger.debug('This is a debug message', 'ExampleService')
        this.logger.verbose('This is a verbose message', 'ExampleService')
        this.logger.warn('This is a warning message', 'ExampleService')

        // Error logging
        try {
            // Simulate an error
            throw new Error('This is a simulated error')
        } catch (error) {
            this.logger.error('An error occurred', error.stack, 'ExampleService', {
                operation: 'demonstrateLogging',
                errorDetails: error.message,
            })
        }
    }

    /**
     * Example method that demonstrates logging in an async method
     */
    public async asyncOperation() {
        this.logger.log('Starting async operation', 'ExampleService')

        try {
            // Simulate async operation
            await new Promise((resolve) => setTimeout(resolve, 100))

            this.logger.log('Async operation completed successfully', 'ExampleService', { duration: '100ms' })

            return { success: true }
        } catch (error) {
            this.logger.error('Async operation failed', error.stack, 'ExampleService')
            throw error
        }
    }
}
