import { ApiProperty } from '@nestjs/swagger'
import { getSchemaPath } from '@nestjs/swagger'

/**
 * Modelo de resposta para progresso da timeline
 */
export class TimelineProgressResponse {
    @ApiProperty({
        example: 75,
        description: 'Porcentagem de progresso (0-100)',
    })
    progress_percentage: number

    @ApiProperty({
        example: '2023-01-15T00:00:00Z',
        description: 'Data em que a medição foi realizada',
    })
    measurement_date: Date

    @ApiProperty({
        example: '2023-01-15T12:30:45Z',
        description: 'Data em que a medição foi publicada',
    })
    publication_date: Date
}

/**
 * Modelo de resposta para dados de tarefa
 */
export class TaskResponse {
    @ApiProperty({
        example: '20',
        description: 'Identificador único para a tarefa',
    })
    id: string

    @ApiProperty({
        example: 'Trabalho de fundação',
        description: 'Nome da tarefa',
    })
    name: string

    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Data de início planejada da tarefa',
    })
    start_date: Date

    @ApiProperty({
        example: '2023-02-15T00:00:00Z',
        description: 'Data de término planejada da tarefa',
    })
    end_date: Date

    @ApiProperty({
        example: 0.25,
        description: 'Peso da tarefa em relação ao projeto inteiro (0-1)',
    })
    weight: number

    @ApiProperty({
        example: 36,
        description: 'Duração da tarefa em dias',
    })
    duration: number

    @ApiProperty({
        example: 15000,
        description: 'Custo da tarefa (visível apenas para admin e proprietário)',
        required: false,
    })
    cost?: number

    @ApiProperty({
        example: '1.2.3',
        description: 'Posição hierárquica da tarefa',
        required: false,
    })
    hierarchy?: string

    @ApiProperty({
        example: 0.65,
        description: 'Porcentagem de progresso planejada (0-1)',
    })
    planned_progress: number

    @ApiProperty({
        example: 0.6,
        description: 'Porcentagem de progresso real (0-1)',
    })
    actual_progress: number

    @ApiProperty({
        example: false,
        description: 'Se a tarefa foi editada hoje',
    })
    is_edited_today: boolean

    @ApiProperty({
        example: '2023-01-12T00:00:00Z',
        description: 'Data de início real da tarefa',
        required: false,
    })
    actual_start_date?: Date

    @ApiProperty({
        example: '2023-02-20T00:00:00Z',
        description: 'Data de término real da tarefa',
        required: false,
    })
    actual_end_date?: Date

    @ApiProperty({
        example: 'started',
        description: 'Status de execução atual da tarefa',
        enum: ['planned', 'started', 'completed'],
    })
    execution_status: 'planned' | 'started' | 'completed'

    @ApiProperty({
        example: 'delayed',
        description: 'Status geral comparando progresso planejado vs real',
        enum: ['on_time', 'ahead', 'delayed'],
    })
    overall_status: 'on_time' | 'ahead' | 'delayed'

    @ApiProperty({
        type: [TaskResponse],
        description: 'Lista de subtarefas',
        required: false,
    })
    subtasks?: TaskResponse[]
}

/**
 * Modelo de resposta para dados da timeline
 */
export class TimelineResponse {
    @ApiProperty({
        example: '20',
        description: 'Identificador único para a timeline',
    })
    id: string

    @ApiProperty({
        example: 'Fase 1 de Construção',
        description: 'Nome da timeline',
    })
    name: string

    @ApiProperty({
        example: 'USD',
        description: 'Moeda usada para cálculos de custo',
        required: false,
    })
    currency?: string

    @ApiProperty({
        example: '2023-01-01T00:00:00Z',
        description: 'Data de criação da timeline',
    })
    created_at: Date

    @ApiProperty({
        example: { '2023-01-15': 0.25, '2023-02-01': 0.5, '2023-02-15': 0.75 },
        description: 'Porcentagens de progresso planejadas por data',
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
        description: 'Medições de progresso real por data',
        required: false,
    })
    actual_progress?: Record<string, TimelineProgressResponse>

    @ApiProperty({
        type: [TaskResponse],
        description: 'Lista de tarefas na timeline',
    })
    tasks: TaskResponse[]
}

/**
 * Modelo de resposta para intervalo de datas
 */
export class DateRangeResponse {
    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Data de início da timeline',
    })
    start: Date

    @ApiProperty({
        example: '2023-12-31T00:00:00Z',
        description: 'Data de término da timeline',
    })
    end: Date
}

/**
 * Modelo de resposta para a timeline mais recente
 */
export class LatestTimelineResponse {
    @ApiProperty({
        type: DateRangeResponse,
        description: 'Intervalo de datas da timeline',
    })
    dateRange: DateRangeResponse

    @ApiProperty({
        type: TimelineResponse,
        description: 'Dados da timeline mais recente',
    })
    timeline: TimelineResponse
}

/**
 * Modelo de resposta para dados do dashboard
 */
export class DashboardResponse {
    @ApiProperty({
        example: '2023-01-10T00:00:00Z',
        description: 'Data de início do projeto',
    })
    start_date: Date

    @ApiProperty({
        example: '2023-12-31T00:00:00Z',
        description: 'Data de término do projeto',
    })
    end_date: Date

    @ApiProperty({
        example: '2023-06-15',
        description: 'Data atual no formato AAAA-MM-DD',
    })
    today: string

    @ApiProperty({
        example: 355,
        description: 'Número total de dias no projeto',
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
