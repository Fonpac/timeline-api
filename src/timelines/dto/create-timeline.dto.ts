import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'ID da tarefa' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nome da tarefa' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Data de início da tarefa', example: '2023-01-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Data de término da tarefa', example: '2023-01-31T00:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Custo da tarefa', required: false })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ description: 'Hierarquia da tarefa', required: false })
  @IsOptional()
  @IsString()
  hierarchy?: string;

  @ApiProperty({ description: 'Subtarefas', type: [CreateTaskDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  subtasks?: CreateTaskDto[];
}

export class CreateTimelineDto {
  @ApiProperty({ description: 'Nome da timeline' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Trabalha aos sábados', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  worksSaturdays?: boolean;

  @ApiProperty({ description: 'Trabalha aos domingos', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  worksSundays?: boolean;

  @ApiProperty({ description: 'Moeda', required: false, example: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Lista de tarefas', type: [CreateTaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
} 