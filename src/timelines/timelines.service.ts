import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timeline, ITimeline } from './entities/timeline.schema';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { processTimelineToReturn } from './utils/timeline-processor';
import { startOfDay } from 'date-fns';
import { 
  dateToString, 
  computeTaskExecution, 
  computeTaskDateStatus, 
  daysOfInterval 
} from './utils/timeline-processor';

@Injectable()
export class TimelinesService {
  constructor(
    @InjectModel(Timeline.name) private timelineModel: Model<ITimeline>,
  ) {}

  async getHistoryProjects(projectId: string) {
    const timelines = await this.timelineModel
      .find({ project_id: projectId })
      .sort({ created_at: -1 });

    if (timelines.length === 0) {
      throw new NotFoundException('Timeline not found');
    }

    const history = timelines
      .map(timeline => ({
        id: timeline.id,
        name: timeline.name,
        actual_progress: timeline.actual_progress,
      }))
      .flatMap(item => {
        if (!item.actual_progress) return [];
        return Object.values(item.actual_progress).map(progress => ({
          progress_percentage: progress.progress_percentage,
          measurement_date: progress.measurement_date,
          publication_date: progress.publication_date,
        }));
      })
      .sort((a, b) => {
        return (
          new Date(b.measurement_date).getTime() -
          new Date(a.measurement_date).getTime()
        );
      });

    return history;
  }

  async getAll(projectId: string, permission: string = 'employee') {
    const timelines = await this.timelineModel.find({ project_id: projectId });
    return timelines.map(timeline => 
      processTimelineToReturn(timeline, permission)
    );
  }

  async create(projectId: string, createTimelineDto: CreateTimelineDto) {
    // Create in MongoDB
    const mongoTimeline = new this.timelineModel({
      project_id: projectId,
      name: createTimelineDto.name,
      currency: createTimelineDto.currency || 'BRL',
      created_at: new Date(),
      created_by: 1, // Default value or get from auth context
      planned_progress: {},
      tasks: createTimelineDto.tasks.map(task => ({
        id: task.id,
        name: task.name,
        start_date: new Date(task.startDate),
        end_date: new Date(task.endDate),
        weight: 1 / createTimelineDto.tasks.length,
        duration: Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        cost: task.cost,
        hierarchy: task.hierarchy,
        planned_progress: {},
        actual_progress: {},
        subtasks: task.subtasks ? this.processSubtasks(task.subtasks) : [],
      })),
    });
    
    const savedTimeline = await mongoTimeline.save();
    return savedTimeline;
  }

  private processSubtasks(subtasks: any[]) {
    return subtasks.map(subtask => ({
      id: subtask.id,
      name: subtask.name,
      start_date: new Date(subtask.startDate),
      end_date: new Date(subtask.endDate),
      weight: 1 / subtasks.length,
      duration: Math.ceil((new Date(subtask.endDate).getTime() - new Date(subtask.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      cost: subtask.cost,
      hierarchy: subtask.hierarchy,
      planned_progress: {},
      actual_progress: {},
      subtasks: subtask.subtasks ? this.processSubtasks(subtask.subtasks) : [],
    }));
  }

  async getLatest(projectId: string) {
    const timeline = await this.timelineModel
      .findOne({ project_id: projectId })
      .sort({ created_at: -1 });

    if (!timeline) throw new NotFoundException('Timeline not found');
    return timeline;
  }

  async getDashboard(projectId: string) {
    const timeline = await this.timelineModel
      .findOne({ project_id: projectId })
      .sort({ created_at: -1 });

    if (!timeline) throw new NotFoundException('Timeline not found');

    const minStartDate = timeline.tasks.reduce((acc, task) => {
      if (task.start_date < acc) {
        return task.start_date;
      }
      return acc;
    }, timeline.tasks[0].start_date);

    const maxEndDate = timeline.tasks.reduce((acc, task) => {
      if (task.end_date > acc) {
        return task.end_date;
      }
      return acc;
    }, timeline.tasks[0].end_date);

    const days = Object.keys(timeline.planned_progress);
    const today = dateToString(startOfDay(new Date()));
    const beforeToday = days.filter(day => day < today);
    const afterToday = days.filter(day => day >= today);

    const timelineExecution = timeline.tasks.reduce(
      (acc, task) => {
        const taskExecution = computeTaskExecution(task);

        return {
          planned: acc.planned + taskExecution.planned,
          started: acc.started + taskExecution.started,
          completed: acc.completed + taskExecution.completed
        };
      },
      { planned: 0, started: 0, completed: 0 }
    );

    const timelineDateStatus = timeline.tasks.reduce(
      (acc, task) => {
        const taskDateStatus = computeTaskDateStatus(task);

        return {
          on_time: acc.on_time + taskDateStatus.on_time,
          ahead: acc.ahead + taskDateStatus.ahead,
          delayed: acc.delayed + taskDateStatus.delayed
        };
      },
      { on_time: 0, ahead: 0, delayed: 0 }
    );

    const progressCurves: Record<
      string,
      { planned?: number; actual?: number; original?: number }
    > = {};

    for (const date of Object.keys(timeline.planned_progress)) {
      progressCurves[date] = {
        planned: timeline.planned_progress[date],
        actual: undefined
      };
    }

    for (const date of Object.keys(timeline.actual_progress ?? {})) {
      if (progressCurves[date] === undefined) {
        progressCurves[date] = {};
      }

      progressCurves[date].actual =
        timeline.actual_progress?.[date].progress_percentage;
    }

    const firstTimeline = await this.timelineModel.findOne({
      project_id: projectId,
      _id: { $ne: timeline._id }
    }).sort({ created_at: 1 });

    if (firstTimeline !== null) {
      for (const date of Object.keys(firstTimeline.planned_progress)) {
        if (progressCurves[date] === undefined) {
          progressCurves[date] = {};
        }

        progressCurves[date].original = firstTimeline.planned_progress[date];
      }
    }

    const existingDays = Object.keys(progressCurves).sort();
    const firstDay = existingDays[0];
    const lastDay = existingDays[existingDays.length - 1];
    
    if (firstDay && lastDay) {
      const allDays = daysOfInterval(
        new Date(firstDay),
        new Date(lastDay),
        true,
        true
      ).map(dateToString);

      for (const day of allDays) {
        if (progressCurves[day] === undefined) {
          progressCurves[day] = { planned: undefined, actual: undefined };
        }
      }
    }

    return {
      start_date: minStartDate,
      end_date: maxEndDate,
      today: startOfDay(new Date()).toISOString(),
      total_days: days.length,
      elapsed_days: beforeToday.length,
      remaining_days: afterToday.length,
      progress_curves: progressCurves,
      task_execution: timelineExecution,
      task_date_status: timelineDateStatus
    };
  }

  async getOne(projectId: string, timelineId: string) {
    const timeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    if (!timeline) throw new NotFoundException('Timeline not found');
    return timeline;
  }

  async updateTimeline(projectId: string, timelineId: string, updateData: any) {
    // Update in MongoDB
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: timelineId, project_id: projectId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedTimeline) throw new NotFoundException('Timeline not found');
    return updatedTimeline;
  }

  async deleteOne(projectId: string, timelineId: string) {
    const result = await this.timelineModel.findOneAndDelete({ _id: timelineId, project_id: projectId });
    
    if (!result) throw new NotFoundException('Timeline not found');
    return { message: 'Timeline deleted successfully' };
  }

  async deleteOneDate(projectId: string, timelineId: string, date: Date) {
    const timeline = await this.timelineModel.findOne({
      _id: timelineId,
      project_id: projectId
    });

    if (!timeline) throw new NotFoundException('Timeline not found');

    const dateToDelete = dateToString(startOfDay(date));

    function deleteProgress(tasks: any[]): any[] {
      return tasks.map(task => {
        if (task.actual_progress?.[dateToDelete] !== undefined) {
          task.actual_progress = Object.fromEntries(
            Object.entries(task.actual_progress).filter(
              ([key]) => key !== dateToDelete
            )
          );
        }

        if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
          task.subtasks = deleteProgress(task.subtasks);
        }

        return task;
      });
    }

    timeline.tasks = deleteProgress(timeline.tasks);
    await timeline.save();

    return {
      message: `Progress for date ${dateToDelete} successfully deleted`,
      timeline: processTimelineToReturn(timeline, 'employee')
    };
  }

  async updateTask(
    projectId: string,
    timelineId: string,
    taskId: string,
    updateData: any,
  ) {
    // Update in MongoDB
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: timelineId, project_id: projectId, 'tasks.id': taskId },
      { $set: { 'tasks.$': { ...updateData } } },
      { new: true },
    );

    if (!updatedTimeline) throw new NotFoundException('Timeline or task not found');
    
    // Return the updated task
    const updatedTask = updatedTimeline.tasks.find(task => task.id === taskId);
    return updatedTask;
  }

  async bulkUpdateTask(projectId: string, timelineId: string, updates: any[]) {
    const timeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    if (!timeline) throw new NotFoundException('Timeline not found');

    // Prepare the updates
    const updateOperations = updates.map(update => ({
      updateOne: {
        filter: { _id: timelineId, 'tasks.id': update.task_id },
        update: { $set: { [`tasks.$.${Object.keys(update)[1]}`]: Object.values(update)[1] } }
      }
    }));

    // Apply the updates in batch
    await this.timelineModel.bulkWrite(updateOperations);

    // Fetch the updated timeline
    const updatedTimeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    // Return the updated tasks
    const updatedTasks = updates.map(update => 
      updatedTimeline.tasks.find(task => task.id === update.task_id)
    );

    return updatedTasks;
  }
} 