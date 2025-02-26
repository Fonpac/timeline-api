import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelinesService } from './timelines.service';
import { TimelinesController } from './timelines.controller';
import { Timeline, TimelineSchema } from './entities/timeline.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Timeline.name, schema: TimelineSchema }])
  ],
  controllers: [TimelinesController],
  providers: [TimelinesService],
})
export class TimelinesModule {} 