import { Injectable, LoggerService } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'

@Injectable()
export class LoggingService implements LoggerService {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    log(message: string, context?: string, ...meta: any[]) {
        this.logger.info(message, { context, ...this.formatMeta(meta) })
    }

    error(message: string, trace?: string, context?: string, ...meta: any[]) {
        this.logger.error(message, { trace, context, ...this.formatMeta(meta) })
    }

    warn(message: string, context?: string, ...meta: any[]) {
        this.logger.warn(message, { context, ...this.formatMeta(meta) })
    }

    debug(message: string, context?: string, ...meta: any[]) {
        this.logger.debug(message, { context, ...this.formatMeta(meta) })
    }

    verbose(message: string, context?: string, ...meta: any[]) {
        this.logger.verbose(message, { context, ...this.formatMeta(meta) })
    }

    // Helper method to format metadata
    private formatMeta(meta: any[]): Record<string, any> {
        if (meta.length === 0) {
            return {}
        }

        if (meta.length === 1 && typeof meta[0] === 'object') {
            return meta[0]
        }

        return { meta }
    }
}
