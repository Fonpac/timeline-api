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
} from '@nestjs/common'
import { TimelinesService } from './timelines.service'
import { CreateTimelineDto } from './dto/create-timeline.dto'
import { UpdateTimelineDto } from './dto/update-timeline.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { BulkUpdateTaskDto } from './dto/bulk-update-task.dto'
import { DeleteProgressDto } from './dto/delete-progress.dto'
import { FilterQueryDto } from './dto/filter-query.dto'
import { ApiTags } from '@nestjs/swagger'
import { processTimelineToReturn } from './utils/timeline-processor'
import { Request } from '../auth'

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
    ApiBulkUpdateTask,
} from './documentation'

@ApiTags('timelines')
@Controller('project/:projectId/timelines')
export class TimelinesController {
    constructor(private readonly timelinesService: TimelinesService) {}

    @Get('history')
    @ApiGetHistory()
    async getHistoryProjects(@Param('projectId') projectId: string, @Req() request: Request) {
        // Extract user permission from request (adjust based on your auth implementation)
        const permission = request.user?.permission || 'employee'
        return this.timelinesService.getHistoryProjects(projectId)
    }

    @Get()
    @ApiGetAllTimelines()
    async getAll(@Param('projectId') projectId: string, @Req() request: Request) {
        // Extract user permission from request (adjust based on your auth implementation)
        const permission = request.user?.permission || 'employee'
        return this.timelinesService.getAll(projectId, permission)
    }

    @Post()
    @ApiCreateTimeline()
    async create(@Param('projectId') projectId: string, @Body() createTimelineDto: CreateTimelineDto, @Req() request: Request) {
        try {
            if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
                throw new ForbiddenException('Only admin and owner can create timelines')
            }

            const timeline = await this.timelinesService.create(projectId, createTimelineDto)
            return processTimelineToReturn(timeline, request.user?.permission || 'employee')
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException({ code: 'VALIDATION', errors: error.errors })
            } else if (error.name === 'TaskDurationZeroError') {
                throw new BadRequestException({ code: 'TASK_DURATION_ZERO', task: error.task })
            }
            throw error
        }
    }

    @Get('latest')
    @ApiGetLatestTimeline()
    async getLatest(@Param('projectId') projectId: string, @Query() filterQueryDto: FilterQueryDto, @Req() request: Request) {
        const timeline = await this.timelinesService.getLatest(projectId)

        if (!timeline) {
            throw new NotFoundException('No timeline found for this project')
        }

        const permission = request.user?.permission || 'employee'
        return processTimelineToReturn(timeline, permission)
    }

    @Get('dashboard')
    @ApiGetDashboard()
    async getDashboard(@Param('projectId') projectId: string) {
        return this.timelinesService.getDashboard(projectId)
    }

    @Get(':timelineId')
    @ApiGetOneTimeline()
    async getOne(@Param('projectId') projectId: string, @Param('timelineId') timelineId: string, @Req() request: Request) {
        const timeline = await this.timelinesService.getOne(projectId, timelineId)

        if (!timeline) {
            throw new NotFoundException('Timeline not found')
        }

        const permission = request.user?.permission || 'employee'
        return processTimelineToReturn(timeline, permission)
    }

    @Patch(':timelineId')
    @ApiUpdateTimeline()
    async updateTimeline(
        @Param('projectId') projectId: string,
        @Param('timelineId') timelineId: string,
        @Body() updateTimelineDto: UpdateTimelineDto,
        @Req() request: Request
    ) {
        // Check permissions
        if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
            throw new ForbiddenException('You do not have the permission to update a timeline')
        }

        const timeline = await this.timelinesService.updateTimeline(projectId, timelineId, updateTimelineDto)

        if (!timeline) {
            throw new NotFoundException('Timeline not found')
        }

        const permission = request.user?.permission || 'employee'
        return processTimelineToReturn(timeline, permission)
    }

    @Delete(':timelineId')
    @ApiDeleteTimeline()
    async deleteOne(@Param('projectId') projectId: string, @Param('timelineId') timelineId: string, @Req() request: Request) {
        // Check permissions
        if (request.user?.permission !== 'owner') {
            throw new ForbiddenException('You do not have the permission to delete a timeline')
        }

        await this.timelinesService.deleteOne(projectId, timelineId)
        return null
    }

    @Delete(':timelineId/progress')
    @ApiDeleteProgress()
    async deleteOneDate(
        @Param('projectId') projectId: string,
        @Param('timelineId') timelineId: string,
        @Body() deleteProgressDto: DeleteProgressDto,
        @Req() request: Request
    ) {
        // Check permissions
        if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
            throw new ForbiddenException('You do not have permission to delete progress')
        }

        return this.timelinesService.deleteOneDate(projectId, timelineId, deleteProgressDto.date)
    }

    @Patch(':timelineId/task/:taskId')
    @ApiUpdateMeasurement()
    async updateMeasurement(
        @Param('projectId') projectId: string,
        @Param('timelineId') timelineId: string,
        @Param('taskId') taskId: string,
        @Body() updateMeasurementDto: UpdateMeasurementDto,
        @Req() request: Request
    ) {
        // Check permissions
        if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
            throw new ForbiddenException('You do not have the permission to update a measurement')
        }

        return this.timelinesService.updateTask(projectId, timelineId, taskId, updateMeasurementDto)
    }

    @Patch(':timelineId/task/bulk')
    @ApiBulkUpdateTask()
    async bulkUpdateTask(
        @Param('projectId') projectId: string,
        @Param('timelineId') timelineId: string,
        @Body() bulkUpdateTaskDto: BulkUpdateTaskDto[],
        @Req() request: Request
    ) {
        // Check permissions
        if (request.user?.permission !== 'admin' && request.user?.permission !== 'owner') {
            throw new ForbiddenException('You do not have the permission to update a measurement')
        }

        return this.timelinesService.bulkUpdateTask(projectId, timelineId, bulkUpdateTaskDto)
    }
}
