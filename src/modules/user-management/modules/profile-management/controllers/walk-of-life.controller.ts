import {
  Controller,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
  Put,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdvancedRequest } from 'src/types';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { WalkOfLifeService } from '../services/walk-of-life.service';
import {
  Education,
  Experience,
  Skill,
} from '../interfaces/walk-of-life.interface';

@ApiTags('walk-of-life')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: '1',
  path: '/walk-of-life',
})
export class WalkOfLifeController {
  constructor(private readonly walkOfLifeService: WalkOfLifeService) {}

  @Put('experiences/:id')
  @LogEvent(EventType.EXPERIENCE_UPDATE)
  updateExperiences(
    @Param('id') id: number,
    @Body() experiences: Experience[],
    @Request() req: AdvancedRequest,
  ) {
    req.logInfo = { id: req.user?.sub };
    return this.walkOfLifeService.updateExperiences(id, experiences);
  }

  @Put('educations/:id')
  @LogEvent(EventType.EDUCATION_UPDATE)
  updateEducations(
    @Param('id') id: number,
    @Body() educations: Education[],
    @Request() req: AdvancedRequest,
  ) {
    req.logInfo = { id: req.user?.sub };
    return this.walkOfLifeService.updateEducations(id, educations);
  }
}
