# Logging System for Timeline API

This document describes the logging system implemented for the Timeline API, which is designed to work seamlessly with AWS CloudWatch Log Insights when deployed to ECS.

## Overview

The logging system uses Winston as the logging library and is integrated with NestJS through the `nest-winston` package. It provides structured logging that is optimized for CloudWatch Log Insights queries.

## Features

- **Structured JSON Logging**: All logs are formatted as JSON objects in production and alpha environments, making them easily queryable in CloudWatch Log Insights.
- **Simple Development Logs**: In development mode, logs are simplified to show only essential information.
- **Request/Response Logging**: All HTTP requests and responses are automatically logged with metadata.
- **Error Tracking**: All exceptions are captured and logged with stack traces.
- **Request ID Tracking**: Each request is assigned a unique ID that is included in all related logs.
- **Environment-Aware Configuration**: Different log formats based on the environment (development vs. production/alpha).
- **Sensitive Data Redaction**: Automatically redacts sensitive information like passwords and tokens.

## Log Format

### Production/Alpha Format (CloudWatch)

In production and alpha environments, logs are formatted as JSON objects with the following structure:

```json
{
    "timestamp": "2023-02-26T12:34:56.789Z",
    "level": "info",
    "message": "The log message",
    "metadata": "{\"context\":\"HTTP\",\"requestId\":\"123e4567-e89b-12d3-a456-426614174000\",\"method\":\"GET\",\"url\":\"/api/timelines\",\"statusCode\":200,\"responseTime\":\"42ms\"}"
}
```

This format is optimized for CloudWatch Log Insights queries.

### Development Format

In development mode, logs are simplified to a more readable format:

```
2023-02-26 12:34:56 - INFO: [HTTP] Incoming request: GET /api/timelines
```

This makes it easier to read logs during local development without the extra metadata.

## CloudWatch Log Insights Queries

Here are some example queries you can use in CloudWatch Log Insights:

### Find all logs for a specific request ID

```
fields @timestamp, @message
| parse @message "\"requestId\":\"*\"" as requestId
| filter requestId = "123e4567-e89b-12d3-a456-426614174000"
| sort @timestamp asc
```

### Find all error logs

```
fields @timestamp, @message
| filter level = "error"
| sort @timestamp desc
```

### Find slow responses (>500ms)

```
fields @timestamp, @message
| parse @message "\"responseTime\":\"*ms\"" as responseTime
| filter responseTime > 500
| sort responseTime desc
```

### Count requests by status code

```
fields @timestamp, @message
| parse @message "\"statusCode\":*," as statusCode
| stats count(*) as count by statusCode
| sort count desc
```

## Local Development

In development mode, logs are printed to the console in a simplified format that shows only the timestamp, log level, context (if available), and message. This makes the logs much more readable during local development.

## Usage in Code

To use the logger in your code:

```typescript
import { Injectable } from '@nestjs/common'
import { LoggingService } from '../logging/logging.service'

@Injectable()
export class YourService {
    constructor(private readonly logger: LoggingService) {}

    someMethod() {
        this.logger.log('This is an info message', 'YourService', {
            additionalData: 'some value',
        })

        try {
            // Some code that might throw
        } catch (error) {
            this.logger.error('An error occurred', error.stack, 'YourService', {
                additionalData: 'some value',
            })
        }
    }
}
```

## ECS Configuration

When deployed to ECS, the logs will automatically be sent to CloudWatch. No additional configuration is needed in the application code, as ECS handles the log forwarding to CloudWatch.
