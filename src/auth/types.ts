import { Request as ExpressRequest } from 'express'

export interface ContextData {
    userId: string
    permission?: string
    canEditTimeline?: boolean
}

export interface Request extends ExpressRequest {
    user: ContextData
}
