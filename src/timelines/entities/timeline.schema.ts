import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export interface TaskProgress {
  progress_percentage: number;
  measurement_date: Date;
  publication_date: Date;
}

@Schema({ timestamps: true })
export class Timeline extends Document {
  @ApiProperty({ description: 'ID do projeto' })
  @Prop({ required: true })
  projectId: string;

  @ApiProperty({ description: 'Nome da timeline' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Descrição da timeline' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Data de início' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ description: 'Data de término' })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({ 
    description: 'Progresso planejado',
    type: 'object',
    additionalProperties: true
  })
  @Prop({ type: Object })
  planned_progress: Record<string, number>;

  @ApiProperty({ 
    description: 'Progresso atual',
    type: 'object',
    additionalProperties: true,
    nullable: true
  })
  @Prop({ type: Object })
  actual_progress?: Record<string, TaskProgress>;

  @ApiProperty({ description: 'Lista de tarefas', type: [Object] })
  @Prop({ type: [{ 
    id: String,
    name: String,
    startDate: Date,
    endDate: Date,
    actualStartDate: Date,
    actualEndDate: Date,
    weight: Number,
    duration: Number,
    cost: Number,
    hierarchy: String,
    planned_progress: Object,
    actual_progress: Object,
    executionStatus: {
      type: String,
      enum: ['planned', 'started', 'completed']
    },
    overallStatus: {
      type: String,
      enum: ['on_time', 'delayed', 'ahead']
    },
    subtasks: Array
  }] })
  tasks: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    weight: number;
    duration: number;
    cost?: number;
    hierarchy?: string;
    planned_progress: Record<string, number>;
    actual_progress?: Record<string, TaskProgress>;
    executionStatus?: 'planned' | 'started' | 'completed';
    overallStatus?: 'on_time' | 'delayed' | 'ahead';
    subtasks?: any[];
  }>;
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline); 