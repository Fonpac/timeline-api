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
  Req,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { BulkUpdateTaskDto } from './dto/bulk-update-task.dto';
import { DeleteProgressDto } from './dto/delete-progress.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { processTimelineToReturn } from './utils/timeline-processor';

@ApiTags('timelines')
@Controller('project/:projectId/timelines')
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get timeline history for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Returns timeline history' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  async getHistoryProjects(@Param('projectId') projectId: string, @Req() request: any) {
    const timelines = await this.timelinesService.getHistoryProjects(projectId);
    
    // Extract user permission from request (adjust based on your auth implementation)
    const permission = request.user?.permission || 'employee';
    
    return timelines;
  }

  @Get()
  @ApiOperation({ summary: 'Get all timelines for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Returns all timelines' })
  async getAll(@Param('projectId') projectId: string, @Req() request: any) {
    // Extract user permission from request (adjust based on your auth implementation)
    const permission = request.user?.permission || 'employee';
    
    const timelines = await this.timelinesService.getAll(projectId, permission);
    return timelines;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new timeline' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiBody({ type: CreateTimelineDto })
  @ApiResponse({ status: 201, description: 'Timeline created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @ApiOperation({ summary: 'Get the latest timeline for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiQuery({ name: 'planned_status', required: false, isArray: true, enum: ['to_start', 'in_progress', 'to_complete'] })
  @ApiQuery({ name: 'execution_status', required: false, isArray: true, enum: ['planned', 'started', 'completed'] })
  @ApiQuery({ name: 'overall_status', required: false, isArray: true, enum: ['on_time', 'ahead', 'delayed'] })
  @ApiQuery({ name: 'start_date', required: false, type: Date })
  @ApiQuery({ name: 'end_date', required: false, type: Date })
  @ApiQuery({ name: 'score_on_date', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Returns the latest timeline' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  async getLatest(
    @Param('projectId') projectId: string,
    @Query() query: any,
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
      timeline: processTimelineToReturn(timeline, permission, query.score_on_date)
    };
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard data for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Returns dashboard data' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  async getDashboard(@Param('projectId') projectId: string) {
    // This is a placeholder - you'll need to implement the dashboard logic in your service
    return this.timelinesService.getDashboard(projectId);
  }

  @Get(':timelineId')
  @ApiOperation({ summary: 'Get a specific timeline' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiResponse({ status: 200, description: 'Returns the timeline' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
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
  @ApiOperation({ summary: 'Update a timeline' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiBody({ type: UpdateTimelineDto })
  @ApiResponse({ status: 200, description: 'Timeline updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @ApiOperation({ summary: 'Delete a timeline' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiResponse({ status: 204, description: 'Timeline deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @ApiOperation({ summary: 'Delete progress for a specific date' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiBody({ type: DeleteProgressDto })
  @ApiResponse({ status: 200, description: 'Progress deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timeline not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
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
    
    // This is a placeholder - you'll need to implement the delete progress logic in your service
    // The implementation would be similar to the serverless function
    return this.timelinesService.deleteOneDate(projectId, timelineId, deleteProgressDto.date);
  }

  @Patch(':timelineId/task/:taskId')
  @ApiOperation({ summary: 'Update a task measurement' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiBody({ type: UpdateMeasurementDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timeline or task not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
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
    
    // This is a placeholder - you'll need to implement the update task logic in your service
    // The implementation would be similar to the serverless function
    return this.timelinesService.updateTask(projectId, timelineId, taskId, updateMeasurementDto);
  }

  @Patch(':timelineId/task/bulk')
  @ApiOperation({ summary: 'Bulk update tasks' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'timelineId', description: 'Timeline ID' })
  @ApiBody({ type: [BulkUpdateTaskDto] })
  @ApiResponse({ status: 200, description: 'Tasks updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timeline or task not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
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
    
    // This is a placeholder - you'll need to implement the bulk update task logic in your service
    // The implementation would be similar to the serverless function
    return this.timelinesService.bulkUpdateTask(projectId, timelineId, bulkUpdateTaskDto);
  }
} 