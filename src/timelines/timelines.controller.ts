import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Timelines')
@Controller('project/:projectId/timelines')
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @ApiOperation({ summary: 'Obter histórico de projetos' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Histórico de projetos retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Get('history')
  getHistoryProjects(@Param('projectId') projectId: string) {
    return this.timelinesService.getHistoryProjects(projectId);
  }

  @ApiOperation({ summary: 'Obter todas as timelines' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Timelines retornadas com sucesso' })
  @Get()
  getAll(@Param('projectId') projectId: string) {
    return this.timelinesService.getAll(projectId);
  }

  @ApiOperation({ summary: 'Criar uma nova timeline' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiBody({ type: CreateTimelineDto })
  @ApiResponse({ status: 201, description: 'Timeline criada com sucesso' })
  @Post()
  create(@Param('projectId') projectId: string, @Body() createTimelineDto: CreateTimelineDto) {
    return this.timelinesService.create(projectId, createTimelineDto);
  }

  @ApiOperation({ summary: 'Obter a timeline mais recente' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Timeline mais recente retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Get('latest')
  getLatest(@Param('projectId') projectId: string) {
    return this.timelinesService.getLatest(projectId);
  }

  @ApiOperation({ summary: 'Obter dados do dashboard' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Dados do dashboard retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Dados não encontrados' })
  @Get('dashboard')
  getDashboard(@Param('projectId') projectId: string) {
    return this.timelinesService.getDashboard(projectId);
  }

  @ApiOperation({ summary: 'Obter uma timeline específica' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiResponse({ status: 200, description: 'Timeline retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Get(':timelineId')
  getOne(@Param('projectId') projectId: string, @Param('timelineId') timelineId: string) {
    return this.timelinesService.getOne(projectId, timelineId);
  }

  @ApiOperation({ summary: 'Atualizar uma timeline' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiResponse({ status: 200, description: 'Timeline atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Patch(':timelineId')
  updateTimeline(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Body() updateData: any
  ) {
    return this.timelinesService.updateTimeline(projectId, timelineId, updateData);
  }

  @ApiOperation({ summary: 'Excluir uma timeline' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiResponse({ status: 200, description: 'Timeline excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Delete(':timelineId')
  deleteOne(@Param('projectId') projectId: string, @Param('timelineId') timelineId: string) {
    return this.timelinesService.deleteOne(projectId, timelineId);
  }

  @ApiOperation({ summary: 'Excluir progresso de uma data específica' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiQuery({ name: 'date', description: 'Data do progresso a ser excluído', example: '2023-01-15' })
  @ApiResponse({ status: 200, description: 'Progresso excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Delete(':timelineId/progress')
  deleteOneDate(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Query('date') date: string
  ) {
    return this.timelinesService.deleteOneDate(projectId, timelineId, date);
  }

  @ApiOperation({ summary: 'Atualizar medição de uma tarefa' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiParam({ name: 'taskId', description: 'ID da tarefa' })
  @ApiResponse({ status: 200, description: 'Medição atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline ou tarefa não encontrada' })
  @Patch(':timelineId/task/:taskId')
  updateMeasurement(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Param('taskId') taskId: string,
    @Body() updateData: any
  ) {
    return this.timelinesService.updateTask(projectId, timelineId, taskId, updateData);
  }

  @ApiOperation({ summary: 'Atualizar múltiplas tarefas' })
  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiParam({ name: 'timelineId', description: 'ID da timeline' })
  @ApiResponse({ status: 200, description: 'Tarefas atualizadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Timeline não encontrada' })
  @Patch(':timelineId/task/bulk')
  bulkUpdateTask(
    @Param('projectId') projectId: string,
    @Param('timelineId') timelineId: string,
    @Body() updates: any[]
  ) {
    return this.timelinesService.bulkUpdateTask(projectId, timelineId, updates);
  }
} 