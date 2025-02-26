import { ITimeline } from '../entities/timeline.schema';

export interface TaskProgress {
  progress_percentage: number;
  measurement_date: Date;
  publication_date: Date;
}

/**
 * Processes a timeline for returning to the client
 */
export function processTimelineToReturn(
  timeline: ITimeline,
  userPermission: string = 'employee',
  filterDate: Date = new Date()
): any {
  return {
    id: timeline._id,
    name: timeline.name,
    currency: timeline.currency,
    created_at: timeline.created_at,
    planned_progress: timeline.planned_progress,
    actual_progress: timeline.actual_progress,
    tasks: timeline.tasks.map(task =>
      processTaskToReturn(task, userPermission, filterDate)
    )
  };
}

/**
 * Processes a task for returning to the client
 */
export function processTaskToReturn(
  task: any,
  userPermission: string = 'employee',
  filterDate: Date = new Date()
): any {
  return {
    id: task.id,
    name: task.name,
    start_date: task.start_date,
    end_date: task.end_date,
    weight: task.weight,
    duration: task.duration,
    cost: userPermission !== 'employee' ? task.cost : undefined,
    hierarchy: task.hierarchy,
    planned_progress: getNearestPlannedProgress(
      task,
      new Date(filterDate).toISOString()
    ),
    actual_progress: getNearestActualProgress(
      task,
      new Date(filterDate).toISOString()
    ),
    is_edited_today: wasTaskUpdatedOnDate(task, dateToString(filterDate)),
    actual_start_date: task.actual_start_date,
    actual_end_date: task.actual_end_date,
    execution_status: task.executionStatus,
    overall_status: computeOverallStatus(task),
    subtasks: task.subtasks?.map(subtask =>
      processTaskToReturn(subtask, userPermission, filterDate)
    )
  };
}

/**
 * Converts a Date to a string in ISO format
 */
export function dateToString(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

/**
 * Gets the nearest date from a list of dates that is before or equal to the target date
 */
export function getNearestDate(dates: string[], target: string): string | undefined {
  const targetDate = new Date(target);

  const filteredDates = dates
    .map(date => new Date(date))
    .filter(date => 
      new Date(date) <= targetDate || 
      new Date(date).toDateString() === targetDate.toDateString()
    )
    .sort((a, b) => a.getTime() - b.getTime());

  if (filteredDates.length === 0) {
    return undefined;
  }

  return filteredDates[filteredDates.length - 1].toISOString().split('.')[0] + 'Z';
}

/**
 * Gets the nearest planned progress for a task at a specific date
 */
export function getNearestPlannedProgress(task: any, target: string): number {
  const targetDate = new Date(target);

  if (new Date(targetDate) < new Date(task.start_date)) {
    return 0;
  }

  if (new Date(targetDate) > new Date(task.end_date)) {
    return 1;
  }

  const targetOrBefore = getNearestDate(
    Object.keys(task.planned_progress),
    target
  );

  if (targetOrBefore === undefined) {
    return 0;
  }

  return task.planned_progress[targetOrBefore];
}

/**
 * Gets the nearest actual progress for a task at a specific date
 */
export function getNearestActualProgress(task: any, target: string) {
  if (
    task.actual_progress === undefined ||
    Object.keys(task.actual_progress).length === 0
  ) {
    return 0;
  }

  const targetOrBefore = getNearestDate(
    Object.keys(task.actual_progress),
    target
  );

  if (targetOrBefore === undefined) {
    return 0;
  }

  return task.actual_progress[targetOrBefore]?.progress_percentage;
}

/**
 * Checks if a task was updated on a specific date
 */
export function wasTaskUpdatedOnDate(task: any, target: string): boolean {
  if (
    task.actual_progress === undefined ||
    Object.keys(task.actual_progress).length === 0
  ) {
    return false;
  }

  const targetOrBefore = getNearestDate(
    Object.keys(task.actual_progress),
    target
  );

  if (targetOrBefore === undefined) {
    return false;
  }

  const measurementDate = new Date(
    task.actual_progress[targetOrBefore]?.measurement_date
  )
    .toISOString()
    .split('T')[0];
  const targetDate = new Date(target).toISOString().split('T')[0];

  return measurementDate === targetDate;
}

/**
 * Computes the overall status of a task
 */
export function computeOverallStatus(task: any) {
  if (task.actual_end_date !== undefined) {
    if (new Date(task.actual_end_date) < new Date(task.end_date)) {
      return 'ahead';
    }

    if (new Date(task.actual_end_date) > new Date(task.end_date)) {
      return 'delayed';
    }

    return 'on_time';
  }

  const plannedProgress = getNearestPlannedProgress(
    task,
    dateToString(new Date())
  );
  const actualProgress = getNearestActualProgress(
    task,
    dateToString(new Date())
  );

  if (actualProgress < plannedProgress - 0.05) {
    return 'delayed';
  }

  if (actualProgress > plannedProgress + 0.05) {
    return 'ahead';
  }

  return 'on_time';
} 