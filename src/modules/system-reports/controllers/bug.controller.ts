import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { BugService } from '../services/bug.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ResponseBugDto } from '../dtos/bug/response-bug.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { CreateBugDto } from '../dtos/bug/create-bug.dto';
import { AdvancedRequest } from 'src/types';

@ApiTags('bug')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/bug',
})
export class BugController {
  constructor(private readonly bugService: BugService) {}

  @Get('/list')
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseBugDto>> {
    const paginated = await this.bugService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseBugDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseBugDto[]> {
    return toDtoArray(ResponseBugDto, await this.bugService.findAll(options));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseBugDto | null> {
    return toDto(ResponseBugDto, await this.bugService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.BUG_CREATE)
  async create(
    @Body() createBugDto: CreateBugDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseBugDto> {
    const bug = await this.bugService.saveWithDeviceInfo(
      createBugDto,
      req?.user?.sub,
    );
    req.logInfo = { id: bug.id, variant: bug.variant };
    return toDto(ResponseBugDto, bug);
  }

  @Delete(':id')
  @LogEvent(EventType.BUG_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseBugDto | null> {
    const bug = await this.bugService.softDelete(id);
    req.logInfo = { id, variant: bug?.variant };
    return toDto(ResponseBugDto, bug);
  }
}
