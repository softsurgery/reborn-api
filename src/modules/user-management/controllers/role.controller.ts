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
import { RoleService } from '../services/role.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { ResponseRoleDto } from '../dtos/role/response-role.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';

@ApiTags('role')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/role',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseRoleDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseRoleDto>> {
    const paginated = await this.roleService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseRoleDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseRoleDto[]> {
    return toDtoArray(ResponseRoleDto, await this.roleService.findAll(options));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseRoleDto | null> {
    return toDto(ResponseRoleDto, await this.roleService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.ROLE_CREATE)
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRoleDto> {
    const role = await this.roleService.saveWithPermissions(createRoleDto);
    req.logInfo = { id: role.id };
    return toDto(ResponseRoleDto, role);
  }

  @Post('duplicate/:id')
  @LogEvent(EventType.ROLE_DUPLICATE)
  async duplicate(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRoleDto | null> {
    const role = await this.roleService.duplicateWithPermissions(id);
    req.logInfo = { id: role?.id, fid: id };
    return toDto(ResponseRoleDto, role);
  }

  @Put(':id')
  @LogEvent(EventType.ROLE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRoleDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseRoleDto,
      await this.roleService.updateWithPermissions(id, updateRoleDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.ROLE_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRoleDto | null> {
    req.logInfo = { id };
    return toDto(ResponseRoleDto, await this.roleService.softDelete(id));
  }
}
