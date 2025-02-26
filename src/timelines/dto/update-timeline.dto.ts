import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTimelineDto {
  @ApiProperty({ description: 'Timeline name' })
  @IsString()
  name: string;
} 