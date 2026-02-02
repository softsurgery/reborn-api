import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowService } from '../services/follow.service';
import { AdvancedRequest } from 'src/types';
import { EventType } from 'src/app/enums/event-type.enum';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';

@ApiTags('follow')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: '1',
  path: '/follow',
})
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  @LogEvent(EventType.USER_FOLLOW)
  follow(@Param('id') targetId: string, @Request() req: AdvancedRequest) {
    req.logInfo = { id: req.user?.sub, targetId };
    return this.followService.follow(targetId, req.user?.sub);
  }

  @Delete(':id/unfollow')
  @LogEvent(EventType.USER_UNFOLLOW)
  unfollow(@Param('id') targetId: string, @Request() req: AdvancedRequest) {
    req.logInfo = { id: req.user?.sub, targetId };
    return this.followService.unfollow(targetId, req.user?.sub);
  }

  @Get(':id/followers')
  getFollowers(@Param('id') id: string, @Request() req: AdvancedRequest) {
    return this.followService.getFollowers(id, req.user?.sub);
  }

  @Get(':id/following')
  getFollowing(@Param('id') id: string, @Request() req: AdvancedRequest) {
    return this.followService.getFollowing(id, req.user?.sub);
  }

  @Get(':id/data-count')
  getDataCount(@Param('id') userId: string) {
    return this.followService.getDataCount(userId);
  }

  @Get(':id/is-following')
  isFollowing(@Param('id') targetId: string, @Request() req: AdvancedRequest) {
    req.logInfo = { id: req.user?.sub, targetId };
    return this.followService.isFollowing(targetId, req.user?.sub);
  }
}
