/**
 * Standard error response schemas for API documentation
 */

/**
 * Not Found (404) error response
 */
export const notFoundResponse = {
    status: 404,
    description: 'Resource not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Resource not found' },
            error: { type: 'string', example: 'Not Found' },
        },
    },
}

/**
 * Timeline Not Found (404) error response
 */
export const timelineNotFoundResponse = {
    status: 404,
    description: 'Timeline not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Timeline not found' },
            error: { type: 'string', example: 'Not Found' },
        },
    },
}

/**
 * Project Not Found (404) error response
 */
export const projectNotFoundResponse = {
    status: 404,
    description: 'Project not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Project not found' },
            error: { type: 'string', example: 'Not Found' },
        },
    },
}

/**
 * Task Not Found (404) error response
 */
export const taskNotFoundResponse = {
    status: 404,
    description: 'Timeline or task not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Task not found' },
            error: { type: 'string', example: 'Not Found' },
        },
    },
}

/**
 * Forbidden (403) error response
 */
export const forbiddenResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have the required permission' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Forbidden Create Timeline (403) error response
 */
export const forbiddenCreateTimelineResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have the permission to create a timeline' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Forbidden Update Timeline (403) error response
 */
export const forbiddenUpdateTimelineResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have the permission to update a timeline' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Forbidden Delete Timeline (403) error response
 */
export const forbiddenDeleteTimelineResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have the permission to delete a timeline' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Forbidden Delete Progress (403) error response
 */
export const forbiddenDeleteProgressResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have permission to delete progress' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Forbidden Update Measurement (403) error response
 */
export const forbiddenUpdateMeasurementResponse = {
    status: 403,
    description: 'Forbidden',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'You do not have the permission to update a measurement' },
            error: { type: 'string', example: 'Forbidden' },
        },
    },
}

/**
 * Bad Request (400) error response
 */
export const badRequestResponse = {
    status: 400,
    description: 'Invalid input',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Invalid input data' },
            error: { type: 'string', example: 'Bad Request' },
        },
    },
}

/**
 * Validation Error (400) error response
 */
export const validationErrorResponse = {
    status: 400,
    description: 'Invalid input',
    schema: {
        type: 'object',
        properties: {
            code: { type: 'string', example: 'VALIDATION' },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        property: { type: 'string', example: 'tasks[0].weight' },
                        message: { type: 'string', example: 'Weight must be between 0 and 1' },
                    },
                },
            },
        },
    },
}

/**
 * Progress Validation Error (400) error response
 */
export const progressValidationErrorResponse = {
    status: 400,
    description: 'Invalid input',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Progress percentage must be between 0 and 1' },
            error: { type: 'string', example: 'Bad Request' },
        },
    },
}
