import { applyDecorators, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger'

import {
    timelineNotFoundResponse,
    projectNotFoundResponse,
    taskNotFoundResponse,
    forbiddenCreateTimelineResponse,
    forbiddenUpdateTimelineResponse,
    forbiddenDeleteTimelineResponse,
    forbiddenDeleteProgressResponse,
    forbiddenUpdateMeasurementResponse,
    validationErrorResponse,
    progressValidationErrorResponse,
} from './error-responses'

import {
    TimelineResponse,
    LatestTimelineResponse,
    DashboardResponse,
    DeleteProgressResponse,
    timelineResponseSchemaPath,
    dateRangeResponseSchemaPath,
} from './response-models'

import { createTimelineExample, updateTimelineExample, deleteProgressExample, updateMeasurementExample, bulkUpdateTaskExample } from './request-examples'

/**
 * Common project ID parameter decorator
 */
export function ApiProjectParam() {
    return ApiParam({
        name: 'projectId',
        description: 'Project ID',
        example: '20',
    })
}

/**
 * Common timeline ID parameter decorator
 */
export function ApiTimelineParam() {
    return ApiParam({
        name: 'timelineId',
        description: 'Timeline ID',
        example: '60a12e5c9f15c012d8e40ab1',
    })
}

/**
 * Common task ID parameter decorator
 */
export function ApiTaskParam() {
    return ApiParam({
        name: 'taskId',
        description: 'Task ID',
        example: '60a12e5c9f15c012d8e40cd3',
    })
}

/**
 * Filter query parameters decorator
 */
export function ApiFilterQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'planned_status',
            required: false,
            isArray: true,
            enum: ['to_start', 'in_progress', 'to_complete'],
            description: 'Filter by planned status',
        }),
        ApiQuery({
            name: 'execution_status',
            required: false,
            isArray: true,
            enum: ['planned', 'started', 'completed'],
            description: 'Filter by execution status',
        }),
        ApiQuery({
            name: 'overall_status',
            required: false,
            isArray: true,
            enum: ['on_time', 'ahead', 'delayed'],
            description: 'Filter by overall status',
        }),
        ApiQuery({
            name: 'start_date',
            required: false,
            type: Date,
            description: 'Filter by start date',
        }),
        ApiQuery({
            name: 'end_date',
            required: false,
            type: Date,
            description: 'Filter by end date',
        }),
        ApiQuery({
            name: 'score_on_date',
            required: false,
            type: Date,
            description: 'Calculate scores on this date',
        })
    )
}

/**
 * Decorator for the history endpoint
 */
export function ApiGetHistory() {
    return applyDecorators(
        ApiOperation({ summary: 'Get timeline history for a project' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Returns timeline history with progress measurements',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        progress_percentage: { type: 'number', example: 0.75 },
                        measurement_date: { type: 'string', format: 'date-time', example: '2023-01-15T00:00:00Z' },
                        publication_date: { type: 'string', format: 'date-time', example: '2023-01-15T12:30:45Z' },
                    },
                },
            },
        }),
        ApiResponse(timelineNotFoundResponse)
    )
}

/**
 * Decorator for the get all timelines endpoint
 */
export function ApiGetAllTimelines() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all timelines for a project' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Returns all timelines for the project',
            schema: {
                type: 'array',
                items: { $ref: timelineResponseSchemaPath },
            },
        }),
        ApiResponse(projectNotFoundResponse)
    )
}

/**
 * Decorator for the create timeline endpoint
 */
export function ApiCreateTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new timeline' }),
        ApiProjectParam(),
        ApiBody(createTimelineExample),
        ApiResponse({
            status: 201,
            description: 'Timeline created successfully',
            type: TimelineResponse,
        }),
        ApiResponse(validationErrorResponse),
        ApiResponse(forbiddenCreateTimelineResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorator for the get latest timeline endpoint
 */
export function ApiGetLatestTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Get the latest timeline for a project' }),
        ApiProjectParam(),
        ApiFilterQuery(),
        ApiResponse({
            status: 200,
            description: 'Returns the latest timeline with date range information',
            type: LatestTimelineResponse,
        }),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorator for the get dashboard endpoint
 */
export function ApiGetDashboard() {
    return applyDecorators(
        ApiOperation({ summary: 'Get dashboard data for a project' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Returns dashboard data with timeline statistics',
            type: DashboardResponse,
        }),
        ApiResponse(timelineNotFoundResponse)
    )
}

/**
 * Decorator for the get one timeline endpoint
 */
export function ApiGetOneTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Get a specific timeline' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiResponse({
            status: 200,
            description: 'Returns the timeline with all tasks and progress information',
            type: TimelineResponse,
        }),
        ApiResponse(timelineNotFoundResponse)
    )
}

/**
 * Decorator for the update timeline endpoint
 */
export function ApiUpdateTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Update a timeline' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiBody(updateTimelineExample),
        ApiResponse({
            status: 200,
            description: 'Timeline updated successfully',
            type: TimelineResponse,
        }),
        ApiResponse(forbiddenUpdateTimelineResponse),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorator for the delete timeline endpoint
 */
export function ApiDeleteTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete a timeline' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiResponse({
            status: 204,
            description: 'Timeline deleted successfully. No content returned.',
        }),
        ApiResponse(forbiddenDeleteTimelineResponse),
        ApiResponse(timelineNotFoundResponse),
        HttpCode(HttpStatus.NO_CONTENT)
    )
}

/**
 * Decorator for the delete progress endpoint
 */
export function ApiDeleteProgress() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete progress for a specific date' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiBody(deleteProgressExample),
        ApiResponse({
            status: 200,
            description: 'Progress deleted successfully',
            type: DeleteProgressResponse,
        }),
        ApiResponse(forbiddenDeleteProgressResponse),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorator for the update task measurement endpoint
 */
export function ApiUpdateMeasurement() {
    return applyDecorators(
        ApiOperation({ summary: 'Update a task measurement' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiTaskParam(),
        ApiBody(updateMeasurementExample),
        ApiResponse({
            status: 200,
            description: 'Task updated successfully',
            schema: {
                type: 'object',
                properties: {
                    dateRange: { $ref: dateRangeResponseSchemaPath },
                    timeline: { $ref: timelineResponseSchemaPath },
                },
            },
        }),
        ApiResponse(progressValidationErrorResponse),
        ApiResponse(forbiddenUpdateMeasurementResponse),
        ApiResponse(taskNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorator for the bulk update tasks endpoint
 */
export function ApiBulkUpdateTask() {
    return applyDecorators(
        ApiOperation({ summary: 'Bulk update tasks' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiBody(bulkUpdateTaskExample),
        ApiResponse({
            status: 200,
            description: 'Tasks updated successfully',
            schema: {
                type: 'object',
                properties: {
                    dateRange: { $ref: dateRangeResponseSchemaPath },
                    timeline: { $ref: timelineResponseSchemaPath },
                },
            },
        }),
        ApiResponse(progressValidationErrorResponse),
        ApiResponse(forbiddenUpdateMeasurementResponse),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}
