/**
 * Esquemas de resposta de erro padrão para documentação da API
 */

/**
 * Resposta de erro Not Found (404)
 */
export const notFoundResponse = {
    status: 404,
    description: 'Recurso não encontrado',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Recurso não encontrado' },
            error: { type: 'string', example: 'Não Encontrado' },
        },
    },
}

/**
 * Resposta de erro Timeline Not Found (404)
 */
export const timelineNotFoundResponse = {
    status: 404,
    description: 'Timeline não encontrada',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Timeline não encontrada' },
            error: { type: 'string', example: 'Não Encontrado' },
        },
    },
}

/**
 * Resposta de erro Project Not Found (404)
 */
export const projectNotFoundResponse = {
    status: 404,
    description: 'Projeto não encontrado',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Projeto não encontrado' },
            error: { type: 'string', example: 'Não Encontrado' },
        },
    },
}

/**
 * Resposta de erro Task Not Found (404)
 */
export const taskNotFoundResponse = {
    status: 404,
    description: 'Timeline ou tarefa não encontrada',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Tarefa não encontrada' },
            error: { type: 'string', example: 'Não Encontrado' },
        },
    },
}

/**
 * Resposta de erro Forbidden (403)
 */
export const forbiddenResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem a permissão necessária' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Forbidden Create Timeline (403)
 */
export const forbiddenCreateTimelineResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem permissão para criar uma timeline' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Forbidden Update Timeline (403)
 */
export const forbiddenUpdateTimelineResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem permissão para atualizar uma timeline' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Forbidden Delete Timeline (403)
 */
export const forbiddenDeleteTimelineResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem permissão para excluir uma timeline' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Forbidden Delete Progress (403)
 */
export const forbiddenDeleteProgressResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem permissão para excluir progresso' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Forbidden Update Measurement (403)
 */
export const forbiddenUpdateMeasurementResponse = {
    status: 403,
    description: 'Proibido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Você não tem permissão para atualizar uma medição' },
            error: { type: 'string', example: 'Proibido' },
        },
    },
}

/**
 * Resposta de erro Bad Request (400)
 */
export const badRequestResponse = {
    status: 400,
    description: 'Entrada inválida',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Dados de entrada inválidos' },
            error: { type: 'string', example: 'Requisição Inválida' },
        },
    },
}

/**
 * Resposta de erro Validation Error (400)
 */
export const validationErrorResponse = {
    status: 400,
    description: 'Entrada inválida',
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
                        message: { type: 'string', example: 'O peso deve estar entre 0 e 1' },
                    },
                },
            },
        },
    },
}

/**
 * Resposta de erro Progress Validation Error (400)
 */
export const progressValidationErrorResponse = {
    status: 400,
    description: 'Entrada inválida',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'A porcentagem de progresso deve estar entre 0 e 1' },
            error: { type: 'string', example: 'Requisição Inválida' },
        },
    },
}
