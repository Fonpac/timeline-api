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
 * Decorador comum para parâmetro de ID do projeto
 */
export function ApiProjectParam() {
    return ApiParam({
        name: 'projectId',
        description: 'ID do Projeto',
        example: '20',
    })
}

/**
 * Decorador comum para parâmetro de ID da timeline
 */
export function ApiTimelineParam() {
    return ApiParam({
        name: 'timelineId',
        description: 'ID da Timeline',
        example: '60a12e5c9f15c012d8e40ab1',
    })
}

/**
 * Decorador comum para parâmetro de ID da tarefa
 */
export function ApiTaskParam() {
    return ApiParam({
        name: 'taskId',
        description: 'ID da Tarefa',
        example: '60a12e5c9f15c012d8e40cd3',
    })
}

/**
 * Decorador para parâmetros de consulta de filtro
 */
export function ApiFilterQuery() {
    return applyDecorators(
        ApiQuery({
            name: 'planned_status',
            required: false,
            isArray: true,
            enum: ['to_start', 'in_progress', 'to_complete'],
            description: 'Filtrar por status planejado',
        }),
        ApiQuery({
            name: 'execution_status',
            required: false,
            isArray: true,
            enum: ['planned', 'started', 'completed'],
            description: 'Filtrar por status de execução',
        }),
        ApiQuery({
            name: 'overall_status',
            required: false,
            isArray: true,
            enum: ['on_time', 'ahead', 'delayed'],
            description: 'Filtrar por status geral',
        }),
        ApiQuery({
            name: 'start_date',
            required: false,
            type: Date,
            description: 'Filtrar por data de início',
        }),
        ApiQuery({
            name: 'end_date',
            required: false,
            type: Date,
            description: 'Filtrar por data de término',
        }),
        ApiQuery({
            name: 'score_on_date',
            required: false,
            type: Date,
            description: 'Calcular pontuações nesta data',
        })
    )
}

/**
 * Decorador para o endpoint de histórico
 */
export function ApiGetHistory() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter histórico da timeline para um projeto' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Retorna o histórico da timeline com medições de progresso',
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
 * Decorador para o endpoint de obter todas as timelines
 */
export function ApiGetAllTimelines() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter todas as timelines de um projeto' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Retorna todas as timelines do projeto',
            schema: {
                type: 'array',
                items: { $ref: timelineResponseSchemaPath },
            },
        }),
        ApiResponse(projectNotFoundResponse)
    )
}

/**
 * Decorador para o endpoint de criar timeline
 */
export function ApiCreateTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Criar uma nova timeline' }),
        ApiProjectParam(),
        ApiBody(createTimelineExample),
        ApiResponse({
            status: 201,
            description: 'Timeline criada com sucesso',
            type: TimelineResponse,
        }),
        ApiResponse(validationErrorResponse),
        ApiResponse(forbiddenCreateTimelineResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorador para o endpoint de obter a timeline mais recente
 */
export function ApiGetLatestTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter a timeline mais recente de um projeto' }),
        ApiProjectParam(),
        ApiFilterQuery(),
        ApiResponse({
            status: 200,
            description: 'Retorna a timeline mais recente com informações de intervalo de datas',
            type: LatestTimelineResponse,
        }),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorador para o endpoint de obter dashboard
 */
export function ApiGetDashboard() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter dados do dashboard para um projeto' }),
        ApiProjectParam(),
        ApiResponse({
            status: 200,
            description: 'Retorna dados do dashboard com estatísticas da timeline',
            type: DashboardResponse,
        }),
        ApiResponse(timelineNotFoundResponse)
    )
}

/**
 * Decorador para o endpoint de obter uma timeline específica
 */
export function ApiGetOneTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter uma timeline específica' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiResponse({
            status: 200,
            description: 'Retorna a timeline com todas as tarefas e informações de progresso',
            type: TimelineResponse,
        }),
        ApiResponse(timelineNotFoundResponse)
    )
}

/**
 * Decorador para o endpoint de atualizar timeline
 */
export function ApiUpdateTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Atualizar uma timeline' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiBody(updateTimelineExample),
        ApiResponse({
            status: 200,
            description: 'Timeline atualizada com sucesso',
            type: TimelineResponse,
        }),
        ApiResponse(forbiddenUpdateTimelineResponse),
        ApiResponse(timelineNotFoundResponse),
        UsePipes(new ValidationPipe({ transform: true }))
    )
}

/**
 * Decorador para o endpoint de excluir timeline
 */
export function ApiDeleteTimeline() {
    return applyDecorators(
        ApiOperation({ summary: 'Excluir uma timeline' }),
        ApiProjectParam(),
        ApiTimelineParam(),
        ApiResponse({
            status: 204,
            description: 'Timeline excluída com sucesso. Nenhum conteúdo retornado.',
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
