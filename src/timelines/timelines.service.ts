import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timeline, ITimeline } from './entities/timeline.schema';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { processTimelineToReturn } from './utils/timeline-processor';

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
      throw new NotFoundException('Timeline não encontrada');
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
    // Criar no MongoDB
    const mongoTimeline = new this.timelineModel({
      project_id: projectId,
      name: createTimelineDto.name,
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
        planned_progress: {},
        actual_progress: {},
      })),
    });
    
    const savedTimeline = await mongoTimeline.save();
    return savedTimeline;
  }

  async getLatest(projectId: string) {
    const timeline = await this.timelineModel
      .findOne({ project_id: projectId })
      .sort({ created_at: -1 });

    if (!timeline) throw new NotFoundException('Timeline não encontrada');
    return timeline;
  }

  async getDashboard(projectId: string) {
    // Método a ser implementado posteriormente
    // Deve retornar dados consolidados para o dashboard
    return {
      message: 'Método a ser implementado',
      projectId,
    };
  }

  async getOne(projectId: string, timelineId: string) {
    const timeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    if (!timeline) throw new NotFoundException('Timeline não encontrada');
    return timeline;
  }

  async updateTimeline(projectId: string, timelineId: string, updateData: any) {
    // Atualizar no MongoDB
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: timelineId, project_id: projectId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedTimeline) throw new NotFoundException('Timeline não encontrada');
    return updatedTimeline;
  }

  async deleteOne(projectId: string, timelineId: string) {
    const result = await this.timelineModel.findOneAndDelete({ _id: timelineId, project_id: projectId });
    
    if (!result) throw new NotFoundException('Timeline não encontrada');
    return { message: 'Timeline excluída com sucesso' };
  }

  async deleteOneDate(projectId: string, timelineId: string, date: string) {
    // Método a ser implementado posteriormente
    // Deve excluir o progresso de uma data específica
    return {
      message: 'Método a ser implementado',
      projectId,
      timelineId,
      date,
    };
  }

  async updateTask(
    projectId: string,
    timelineId: string,
    taskId: string,
    updateData: any,
  ) {
    // Atualizar no MongoDB
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: timelineId, project_id: projectId, 'tasks.id': taskId },
      { $set: { 'tasks.$': { ...updateData } } },
      { new: true },
    );

    if (!updatedTimeline) throw new NotFoundException('Timeline ou tarefa não encontrada');
    
    // Retornar a tarefa atualizada
    const updatedTask = updatedTimeline.tasks.find(task => task.id === taskId);
    return updatedTask;
  }

  async bulkUpdateTask(projectId: string, timelineId: string, updates: any[]) {
    const timeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    if (!timeline) throw new NotFoundException('Timeline não encontrada');

    // Preparar as atualizações
    const updateOperations = updates.map(update => ({
      updateOne: {
        filter: { _id: timelineId, 'tasks.id': update.taskId },
        update: { $set: { [`tasks.$.${Object.keys(update.data)[0]}`]: Object.values(update.data)[0] } }
      }
    }));

    // Aplicar as atualizações em lote
    await this.timelineModel.bulkWrite(updateOperations);

    // Buscar a timeline atualizada
    const updatedTimeline = await this.timelineModel.findOne({ 
      _id: timelineId, 
      project_id: projectId 
    });

    // Retornar as tarefas atualizadas
    const updatedTasks = updates.map(update => 
      updatedTimeline.tasks.find(task => task.id === update.taskId)
    );

    return updatedTasks;
  }
} 