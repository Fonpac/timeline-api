import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDate, IsEnum, IsOptional } from 'class-validator'
import { Transform, Type } from 'class-transformer'

enum PlannedStatus {
    TO_START = 'to_start',
    IN_PROGRESS = 'in_progress',
    TO_COMPLETE = 'to_complete',
}

enum ExecutionStatus {
    PLANNED = 'planned',
    STARTED = 'started',
    COMPLETED = 'completed',
}

enum OverallStatus {
    ON_TIME = 'on_time',
    AHEAD = 'ahead',
    DELAYED = 'delayed',
}

export class FilterQueryDto {
    @ApiProperty({
        description: 'Filter by planned status',
        required: false,
        isArray: true,
        enum: PlannedStatus,
        example: ['to_start', 'in_progress'],
        examples: {
            single: {
                value: ['to_start'],
                description: 'Filter for tasks that are yet to start',
            },
            multiple: {
                value: ['in_progress', 'to_complete'],
                description: 'Filter for tasks that are in progress or to be completed',
            },
            all: {
                value: ['to_start', 'in_progress', 'to_complete'],
                description: 'Include all planned statuses',
            },
        },
    })
    @IsOptional()
    @IsEnum(PlannedStatus, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    planned_status?: PlannedStatus[]

    @ApiProperty({
        description: 'Filter by execution status',
        required: false,
        isArray: true,
        enum: ExecutionStatus,
        example: ['planned', 'started'],
        examples: {
            notStarted: {
                value: ['planned'],
                description: 'Filter for tasks that are planned but not started',
            },
            inExecution: {
                value: ['started'],
                description: 'Filter for tasks that have been started',
            },
            finished: {
                value: ['completed'],
                description: 'Filter for completed tasks',
            },
        },
    })
    @IsOptional()
    @IsEnum(ExecutionStatus, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    execution_status?: ExecutionStatus[]

    @ApiProperty({
        description: 'Filter by overall status',
        required: false,
        isArray: true,
        enum: OverallStatus,
        example: ['on_time'],
        examples: {
            onSchedule: {
                value: ['on_time'],
                description: 'Filter for tasks that are on schedule',
            },
            goodProgress: {
                value: ['ahead'],
                description: 'Filter for tasks that are ahead of schedule',
            },
            behindSchedule: {
                value: ['delayed'],
                description: 'Filter for tasks that are delayed',
            },
            notDelayed: {
                value: ['on_time', 'ahead'],
                description: 'Filter for tasks that are not delayed',
            },
        },
    })
    @IsOptional()
    @IsEnum(OverallStatus, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    overall_status?: OverallStatus[]

    @ApiProperty({
        description: 'Filter by start date',
        required: false,
        type: Date,
        example: '2023-06-01',
        examples: {
            isoFormat: {
                value: '2023-06-01T00:00:00.000Z',
                description: 'ISO format date',
            },
            simpleFormat: {
                value: '2023-06-01',
                description: 'Simple date format',
            },
        },
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_date?: Date

    @ApiProperty({
        description: 'Filter by end date',
        required: false,
        type: Date,
        example: '2023-12-31',
        examples: {
            isoFormat: {
                value: '2023-12-31T23:59:59.999Z',
                description: 'ISO format date (end of day)',
            },
            simpleFormat: {
                value: '2023-12-31',
                description: 'Simple date format',
            },
        },
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_date?: Date

    @ApiProperty({
        description: 'Calculate scores on this date',
        required: false,
        type: Date,
        example: '2023-09-15',
        examples: {
            today: {
                value: new Date().toISOString().split('T')[0],
                description: 'Calculate scores as of today',
            },
            specificDate: {
                value: '2023-09-15',
                description: 'Calculate scores as of a specific date',
            },
        },
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    score_on_date?: Date
}
