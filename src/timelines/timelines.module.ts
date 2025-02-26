import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TimelinesController } from './timelines.controller'
import { TimelinesService } from './timelines.service'
import { Timeline, TimelineSchema } from './entities/timeline.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: Timeline.name, schema: TimelineSchema }])],
    controllers: [TimelinesController],
    providers: [TimelinesService],
    exports: [TimelinesService],
})
export class TimelinesModule {}
