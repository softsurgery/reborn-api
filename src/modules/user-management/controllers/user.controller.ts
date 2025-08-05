import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ResponseUserDto } from '../dtos/user/response-user.dto';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';

@ApiTags('user')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(@Query() query: IQueryObject): Promise<ResponseUserDto | null> {
    return toDto(
      ResponseUserDto,
      await this.userService.findOneByCondition(query),
    );
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseUserDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseUserDto>> {
    const paginated = await this.userService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseUserDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseUserDto[]> {
    const users = await this.userService.findAll(options);
    return toDtoArray(ResponseUserDto, users);
  }

  @Get('/email/:email')
  async findOneByEmail(
    @Param('email') email: string,
  ): Promise<ResponseUserDto | null> {
    return toDto(ResponseUserDto, await this.userService.findOneByEmail(email));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseUserDto | null> {
    return toDto(ResponseUserDto, await this.userService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.USER_CREATE)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto> {
    const user = toDto(
      ResponseUserDto,
      await this.userService.save(createUserDto),
    );
    req.logInfo = { id: user.id, firstName: user.firstName };
    return user;
  }

  @Put(':id')
  @LogEvent(EventType.USER_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.update(id, updateUserDto);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/activate/:id')
  @LogEvent(EventType.USER_ACTIVATE)
  async activate(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.activate(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/deactivate/:id')
  @LogEvent(EventType.USER_DEACTIVATE)
  async deactivate(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    req.logInfo = { id };
    return toDto(ResponseUserDto, await this.userService.deactivate(id));
  }

  @Put('/approve/:id')
  @LogEvent(EventType.USER_APPROVE)
  async approve(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.approve(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/disapprove/:id')
  @LogEvent(EventType.USER_DISAPPROVE)
  async disapprove(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.disapprove(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Delete(':id')
  @LogEvent(EventType.USER_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.softDelete(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }
}
