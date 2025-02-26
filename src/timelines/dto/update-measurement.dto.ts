import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateMeasurementDto {
    @ApiProperty({ description: 'Task progress percentage (0-1)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    progress?: number

    @ApiProperty({ description: 'Task actual start date', required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_date?: Date

    @ApiProperty({ description: 'Task actual end date', required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_date?: Date

    @ApiProperty({ description: 'Measurement date', required: false, default: 'current date' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date
}
