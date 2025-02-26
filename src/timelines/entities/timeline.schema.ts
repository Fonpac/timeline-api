import mongoose, { type Document } from 'mongoose'

export interface TaskProgress {
    progress_percentage: number
    measurement_date: Date
    publication_date: Date
}

export interface Task {
    id: string
    name: string
    cost?: number
    start_date: Date
    actual_start_date?: Date
    end_date: Date
    actual_end_date?: Date
    hierarchy?: string
    subtasks?: Task[]
    weight: number
    duration: number
    planned_progress: Record<string, number>
    actual_progress?: Record<string, TaskProgress>
    executionStatus?: 'planned' | 'started' | 'completed'
}

export interface ITimeline extends Document {
    name: string
    project_id: number
    planned_progress: Record<string, number>
    nearest_planned_progress?: number
    actual_progress?: Record<string, TaskProgress>
    tasks: Task[]
    created_at: Date
    created_by: number
    worksSaturdays?: boolean
    worksSundays?: boolean
    currency?: string
}

const TaskSchema = new mongoose.Schema<Task>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: false },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    hierarchy: { type: String, required: false },
    weight: { type: Number, required: true },
    duration: { type: Number, required: true },
    planned_progress: { type: Object, required: true },
    actual_progress: { type: Object, required: false },
    actual_start_date: { type: Date, required: false },
    actual_end_date: { type: Date, required: false },
})

TaskSchema.virtual('executionStatus').get(function (this: Task) {
    if (this.actual_progress === undefined) {
        return 'planned'
    }

    const lastDate = Object.keys(this.actual_progress).sort().at(-1)

    if (lastDate === undefined) {
        return 'planned'
    }

    const lastProgress = this.actual_progress[lastDate].progress_percentage

    if (lastProgress === 0) {
        return 'planned'
    }

    if (lastProgress < 1) {
        return 'started'
    }

    return 'completed'
})

TaskSchema.add({
    subtasks: { type: [TaskSchema], required: false },
})

export const TimelineSchema = new mongoose.Schema<ITimeline>({
    name: { type: String, required: true },
    project_id: { type: Number, required: true },
    planned_progress: { type: Object, required: true },
    actual_progress: { type: Object, required: false },
    tasks: { type: [TaskSchema], required: true },
    created_at: { type: Date, required: true },
    created_by: { type: Number, required: true },
    worksSaturdays: { type: Boolean, required: false },
    worksSundays: { type: Boolean, required: false },
    currency: { type: String, required: false },
})

// Create a class to be compatible with NestJS's InjectModel decorator
export class Timeline {
    constructor() {}
}
// Set the name property for NestJS compatibility
Object.defineProperty(Timeline, 'name', { value: 'Timeline' })

// Register the model
const TimelineModel = mongoose.model<ITimeline>('Timeline', TimelineSchema)

// Export the model for use in services
export { TimelineModel }
