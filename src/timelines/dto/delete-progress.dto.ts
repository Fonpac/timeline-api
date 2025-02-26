import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteProgressDto {
  @ApiProperty({ description: 'Date of the progress to delete' })
  @IsDate()
  @Type(() => Date)
  date: Date;
} 