import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FeedbackController } from './feedback.controller'
import { FeedbackService } from './feedback.service'
import { FeedbackRequestEntity } from './entities/feedback-request.entity'

@Module({
    imports: [TypeOrmModule.forFeature([FeedbackRequestEntity])],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule {}
