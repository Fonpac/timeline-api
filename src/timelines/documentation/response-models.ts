import { ApiProperty } from '@nestjs/swagger'
import { getSchemaPath } from '@nestjs/swagger'

/**
 * Response model for timeline progress
 */
export class TimelineProgressResponse {
    @ApiProperty({
        example: 75,
        description: 'Progress percentage (0-100)',
    })
    progress_percentage: number

    @ApiProperty({
        example: '2023-01-15T00:00:00Z',
        description: 'Date when the measurement was taken',
    })
    measurement_date: Date

    @ApiProperty({
        example: '2023-01-15T12:30:45Z',
        description: 'Date when the measurement was published',
    })
    publication_date: Date
}

/**
 * Response model for task data
 */
export class TaskResponse {
    @ApiProperty({
        example: '20',
        description: 'Unique identifier for the task',
    })
    id: string

    @ApiProperty({
        example: 'Foundation work',
        description: 'Name of the task',
    })
    name: string

    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Planned start date of the task',
    })
    start_date: Date

    @ApiProperty({
        example: '2023-02-15T00:00:00Z',
        description: 'Planned end date of the task',
    })
    end_date: Date

    @ApiProperty({
        example: 0.25,
        description: 'Weight of the task relative to the entire project (0-1)',
    })
    weight: number

    @ApiProperty({
        example: 36,
        description: 'Duration of the task in days',
    })
    duration: number

    @ApiProperty({
        example: 15000,
        description: 'Cost of the task (only visible to admin and owner)',
        required: false,
    })
    cost?: number

    @ApiProperty({
        example: '1.2.3',
        description: 'Hierarchical position of the task',
        required: false,
    })
    hierarchy?: string

    @ApiProperty({
        example: 0.65,
        description: 'Planned progress percentage (0-1)',
    })
    planned_progress: number

    @ApiProperty({
        example: 0.6,
        description: 'Actual progress percentage (0-1)',
    })
    actual_progress: number

    @ApiProperty({
        example: false,
        description: 'Whether the task was edited today',
    })
    is_edited_today: boolean

    @ApiProperty({
        example: '2023-01-12T00:00:00Z',
        description: 'Actual start date of the task',
        required: false,
    })
    actual_start_date?: Date

    @ApiProperty({
        example: '2023-02-20T00:00:00Z',
        description: 'Actual end date of the task',
        required: false,
    })
    actual_end_date?: Date

    @ApiProperty({
        example: 'started',
        description: 'Current execution status of the task',
        enum: ['planned', 'started', 'completed'],
    })
    execution_status: 'planned' | 'started' | 'completed'

    @ApiProperty({
        example: 'delayed',
        description: 'Overall status comparing planned vs actual progress',
        enum: ['on_time', 'ahead', 'delayed'],
    })
    overall_status: 'on_time' | 'ahead' | 'delayed'

    @ApiProperty({
        type: [TaskResponse],
        description: 'List of subtasks',
        required: false,
    })
    subtasks?: TaskResponse[]
}

/**
 * Response model for timeline data
 */
export class TimelineResponse {
    @ApiProperty({
        example: '20',
        description: 'Unique identifier for the timeline',
    })
    id: string

    @ApiProperty({
        example: 'Construction Phase 1',
        description: 'Name of the timeline',
    })
    name: string

    @ApiProperty({
        example: 'USD',
        description: 'Currency used for cost calculations',
        required: false,
    })
    currency?: string

    @ApiProperty({
        example: '2023-01-01T00:00:00Z',
        description: 'Creation date of the timeline',
    })
    created_at: Date

    @ApiProperty({
        example: { '2023-01-15': 0.25, '2023-02-01': 0.5, '2023-02-15': 0.75 },
        description: 'Planned progress percentages by date',
    })
    planned_progress: Record<string, number>

    @ApiProperty({
        example: {
            '2023-01-15': {
                progress_percentage: 0.2,
                measurement_date: '2023-01-15T00:00:00Z',
                publication_date: '2023-01-15T12:30:45Z',
            },
        },
        description: 'Actual progress measurements by date',
        required: false,
    })
    actual_progress?: Record<string, TimelineProgressResponse>

    @ApiProperty({
        type: [TaskResponse],
        description: 'List of tasks in the timeline',
    })
    tasks: TaskResponse[]
}

/**
 * Response model for date range
 */
export class DateRangeResponse {
    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Start date of the timeline',
    })
    start: Date

    @ApiProperty({
        example: '2023-12-31T00:00:00Z',
        description: 'End date of the timeline',
    })
    end: Date
}

/**
 * Response model for latest timeline
 */
export class LatestTimelineResponse {
    @ApiProperty({
        type: DateRangeResponse,
        description: 'Date range of the timeline',
    })
    dateRange: DateRangeResponse

    @ApiProperty({
        type: TimelineResponse,
        description: 'The latest timeline data',
    })
    timeline: TimelineResponse
}

/**
 * Response model for dashboard data
 */
export class DashboardResponse {
    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Start date of the project',
    })
    start_date: Date

    @ApiProperty({
        example: '2023-12-31T00:00:00Z',
        description: 'End date of the project',
    })
    end_date: Date

    @ApiProperty({
        example: '2023-06-15',
        description: 'Current date in YYYY-MM-DD format',
    })
    today: string

    @ApiProperty({
        example: 355,
        description: 'Total number of days in the project',
    })
    total_days: number

    @ApiProperty({
        example: 156,
        description: 'Number of days elapsed since project start',
    })
    elapsed_days: number

    @ApiProperty({
        example: 199,
        description: 'Number of days remaining until project end',
    })
    remaining_days: number

    @ApiProperty({
        example: {
            '2023-01-15': { planned: 0.1, actual: 0.08, original: 0.1 },
            '2023-02-01': { planned: 0.25, actual: 0.22, original: 0.25 },
        },
        description: 'Progress curves showing planned, actual, and original progress by date',
    })
    progress_curves: Record<string, { planned?: number; actual?: number; original?: number }>

    @ApiProperty({
        example: { planned: 10, started: 15, completed: 25 },
        description: 'Count of tasks by execution status',
    })
    task_execution: { planned: number; started: number; completed: number }

    @ApiProperty({
        example: { on_time: 30, ahead: 5, delayed: 15 },
        description: 'Count of tasks by date status',
    })
    task_date_status: { on_time: number; ahead: number; delayed: number }
}

/**
 * Response model for delete progress operation
 */
export class DeleteProgressResponse {
    @ApiProperty({
        example: 'Progress for date 2023-06-15 has been deleted successfully',
        description: 'Success message',
    })
    message: string

    @ApiProperty({
        type: TimelineResponse,
        description: 'Updated timeline after deletion',
    })
    timeline: TimelineResponse
}

// Export schema path helpers for use in controller
export const timelineResponseSchemaPath = getSchemaPath(TimelineResponse)
export const dateRangeResponseSchemaPath = getSchemaPath(DateRangeResponse)
export const taskResponseSchemaPath = getSchemaPath(TaskResponse)
