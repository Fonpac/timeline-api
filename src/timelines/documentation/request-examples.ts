/**
 * Request body examples for API documentation
 */

/**
 * Create timeline request example
 */
export const createTimelineExample = {
    type: 'CreateTimelineDto',
    examples: {
        basic: {
            value: {
                name: 'Construction Phase 1',
                currency: 'USD',
                tasks: [
                    {
                        id: 'task-1',
                        name: 'Foundation work',
                        startDate: '2023-01-10',
                        endDate: '2023-02-15',
                        weight: 0.25,
                        cost: 15000,
                    },
                    {
                        id: 'task-2',
                        name: 'Framing',
                        startDate: '2023-02-16',
                        endDate: '2023-03-30',
                        weight: 0.35,
                        cost: 25000,
                    },
                ],
            },
            summary: 'Basic timeline with two tasks',
        },
        withSubtasks: {
            value: {
                name: 'Construction Phase 2',
                currency: 'USD',
                worksSaturdays: true,
                tasks: [
                    {
                        id: 'task-1',
                        name: 'Electrical work',
                        startDate: '2023-04-01',
                        endDate: '2023-05-15',
                        weight: 0.4,
                        cost: 18000,
                        subtasks: [
                            {
                                id: 'subtask-1-1',
                                name: 'Wiring',
                                startDate: '2023-04-01',
                                endDate: '2023-04-20',
                                weight: 0.6,
                                cost: 10000,
                            },
                            {
                                id: 'subtask-1-2',
                                name: 'Fixtures',
                                startDate: '2023-04-21',
                                endDate: '2023-05-15',
                                weight: 0.4,
                                cost: 8000,
                            },
                        ],
                    },
                ],
            },
            summary: 'Timeline with nested subtasks',
        },
    },
}

/**
 * Update timeline request example
 */
export const updateTimelineExample = {
    type: 'UpdateTimelineDto',
    examples: {
        nameUpdate: {
            value: {
                name: 'Updated Construction Phase 1',
            },
            summary: 'Update timeline name',
        },
        currencyUpdate: {
            value: {
                currency: 'EUR',
            },
            summary: 'Update timeline currency',
        },
    },
}

/**
 * Delete progress request example
 */
export const deleteProgressExample = {
    type: 'DeleteProgressDto',
    examples: {
        specificDate: {
            value: {
                date: '2023-06-15',
            },
            summary: 'Delete progress for June 15, 2023',
        },
    },
}

/**
 * Update measurement request example
 */
export const updateMeasurementExample = {
    type: 'UpdateMeasurementDto',
    examples: {
        progressUpdate: {
            value: {
                progress: 0.75,
                date: '2023-06-15',
            },
            summary: 'Update task progress to 75%',
        },
        completeTask: {
            value: {
                progress: 1.0,
                date: '2023-06-15',
                end_date: '2023-06-15',
            },
            summary: 'Mark task as completed',
        },
        startTask: {
            value: {
                progress: 0.1,
                date: '2023-06-01',
                start_date: '2023-06-01',
            },
            summary: 'Mark task as started',
        },
    },
}

/**
 * Bulk update task request example
 */
export const bulkUpdateTaskExample = {
    type: '[BulkUpdateTaskDto]',
    examples: {
        multipleTaskUpdate: {
            value: [
                {
                    task_id: '60a12e5c9f15c012d8e40cd3',
                    progress: 0.8,
                    date: '2023-06-15',
                },
                {
                    task_id: '60a12e5c9f15c012d8e40cd4',
                    progress: 0.6,
                    date: '2023-06-15',
                },
            ],
            summary: 'Update progress for multiple tasks',
        },
        completeMultipleTasks: {
            value: [
                {
                    task_id: '60a12e5c9f15c012d8e40cd3',
                    progress: 1.0,
                    date: '2023-06-15',
                    end_date: '2023-06-15',
                },
                {
                    task_id: '60a12e5c9f15c012d8e40cd4',
                    progress: 1.0,
                    date: '2023-06-15',
                    end_date: '2023-06-15',
                },
            ],
            summary: 'Mark multiple tasks as completed',
        },
    },
}
