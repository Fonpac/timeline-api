import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req
} from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { BulkUpdateTaskDto } from './dto/bulk-update-task.dto';
import { DeleteProgressDto } from './dto/delete-progress.dto';
import { FilterQueryDto } from './dto/filter-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { processTimelineToReturn } from './utils/timeline-processor';

// Import custom decorators
import {
  ApiGetHistory,
  ApiGetAllTimelines,
  ApiCreateTimeline,
  ApiGetLatestTimeline,
  ApiGetDashboard,
  ApiGetOneTimeline,
  ApiUpdateTimeline,
  ApiDeleteTimeline,
  ApiDeleteProgress,
  ApiUpdateMeasurement,
  ApiBulkUpdateTask
} from './documentation';

@ApiTags('timelines')
@Controller('project/:projectId/timelines')
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Get('history')
  @ApiGetHistory()
  async getHistoryProjects(@Param('projectId') projectId: string, @Req() request: any) {
    const timelines = await this.timelinesService.getHistoryProjects(projectId);
    
    // Extract user permission from request (adjust based on your auth implementation)
    const permission = request.user?.permission || 'employee';
    
    return timelines;
  }

  @Get()
  @ApiGetAllTimelines()
  async getAll(@Param('projectId') projectId: string, @Req() request: any) {
    // Extract user permission from request (adjust based on your auth implementation)
    const permission = request.user?.permission || 'employee';
    
    const timelines = await this.timelinesService.getAll(projectId, permission);
    return timelines;
  }

  @Post()
  @ApiCreateTimeline()
  async create(
    @Param('projectId') projectId: string, 
    @Body() createTimelineDto: CreateTimelineDto,
    @Req() request: any
  ) {
    // Check permissions (adjust based on your auth implementation)
    if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have the permission to create a timeline');
    }
    
    try {
      const timeline = await this.timelinesService.create(projectId, createTimelineDto);
      return processTimelineToReturn(timeline, request.user?.permission || 'employee');
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException({ code: 'VALIDATION', errors: error.errors });
      } else if (error.name === 'DurationZeroError') {
        throw new BadRequestException({ code: 'TASK_DURATION_ZERO', task: error.task });
      }
      throw error;
    }
  }

  @Get('latest')
  @ApiGetLatestTimeline()
  async getLatest(
    @Param('projectId') projectId: string,
    @Query() filterQueryDto: FilterQueryDto,
    @Req() request: any
  ) {
    const timeline = await this.timelinesService.getLatest(projectId);
    
    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }
    
    // Process filters and return timeline
    // Note: You'll need to implement filter processing in your service
    const permission = request.user?.permission || 'employee';
    
    // Calculate date range
    let minStartDate = null;
    let maxEndDate = null;
    
    if (timeline.tasks.length > 0) {
      minStartDate = timeline.tasks.reduce((acc, task) => 
        task.start_date < acc ? task.start_date : acc, 
        timeline.tasks[0].start_date
      );
      
      maxEndDate = timeline.tasks.reduce((acc, task) => 
        task.end_date > acc ? task.end_date : acc, 
        timeline.tasks[0].end_date
      );
    }
    
    return {
      dateRange: {
        start: minStartDate,
        end: maxEndDate
      },
      timeline: processTimelineToReturn(timeline, permission, filterQueryDto.score_on_date)
    };
  }

  @Get('dashboard')
  @ApiGetDashboard()
  async getDashboard(@Param('projectId') projectId: string) {
    return this.timelinesService.getDashboard(projectId);
  }

  @Get(':timelineId')
  @ApiGetOneTimeline()
  async getOne(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Req() request: any
  ) {
    const timeline = await this.timelinesService.getOne(projectId, timelineId);
    
    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }
    
    const permission = request.user?.permission || 'employee';
    return processTimelineToReturn(timeline, permission);
  }

  @Patch(':timelineId')
  @ApiUpdateTimeline()
  async updateTimeline(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
    @Req() request: any
  ) {
    // Check permissions
    if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have the permission to update a timeline');
    }
    
    const timeline = await this.timelinesService.updateTimeline(
      projectId, 
      timelineId, 
      updateTimelineDto
    );
    
    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }
    
    const permission = request.user?.permission || 'employee';
    return processTimelineToReturn(timeline, permission);
  }

  @Delete(':timelineId')
  @ApiDeleteTimeline()
  async deleteOne(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Req() request: any
  ) {
    // Check permissions
    if (request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have the permission to delete a timeline');
    }
    
    await this.timelinesService.deleteOne(projectId, timelineId);
    return null;
  }

  @Delete(':timelineId/progress')
  @ApiDeleteProgress()
  async deleteOneDate(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Body() deleteProgressDto: DeleteProgressDto,
    @Req() request: any
  ) {
    // Check permissions
    if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have permission to delete progress');
    }
    
    return this.timelinesService.deleteOneDate(projectId, timelineId, deleteProgressDto.date);
  }

  @Patch(':timelineId/task/:taskId')
  @ApiUpdateMeasurement()
  async updateMeasurement(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Param('taskId') taskId: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
    @Req() request: any
  ) {
    // Check permissions
    if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have the permission to update a measurement');
    }
    
    return this.timelinesService.updateTask(projectId, timelineId, taskId, updateMeasurementDto);
  }

  @Patch(':timelineId/task/bulk')
  @ApiBulkUpdateTask()
  async bulkUpdateTask(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Body() bulkUpdateTaskDto: BulkUpdateTaskDto[],
    @Req() request: any
  ) {
    // Check permissions
    if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
      throw new ForbiddenException('You do not have the permission to update a measurement');
    }
    
    return this.timelinesService.bulkUpdateTask(projectId, timelineId, bulkUpdateTaskDto);
  }
} 