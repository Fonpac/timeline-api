import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class TaskDto {
  @ApiProperty({ description: 'Task ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Task name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Task start date', example: '2023-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Task end date', example: '2023-01-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Task cost', required: false })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ description: 'Task hierarchy', required: false })
  @IsOptional()
  @IsString()
  hierarchy?: string;

  @ApiProperty({ description: 'Task subtasks', type: [TaskDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  subtasks?: TaskDto[];
}

export class CreateTimelineDto {
  @ApiProperty({ description: 'Timeline name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Timeline currency', required: false, default: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Timeline tasks', type: [TaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @ApiProperty({ description: 'Whether the timeline works on Saturdays', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  worksSaturdays?: boolean;

  @ApiProperty({ description: 'Whether the timeline works on Sundays', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  worksSundays?: boolean;
} 