import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ResponsePermissionDto } from '../dtos/permission/response-permission.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';

@ApiTags('permission')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: '1',
  path: '/permission',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('/list')
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponsePermissionDto>> {
    const paginated = await this.permissionService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponsePermissionDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponsePermissionDto[]> {
    return toDtoArray(
      ResponsePermissionDto,
      await this.permissionService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponsePermissionDto | null> {
    return toDto(
      ResponsePermissionDto,
      await this.permissionService.findOneById(id),
    );
  }
}
