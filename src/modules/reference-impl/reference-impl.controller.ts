import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toDtoArray } from 'src/shared/database/utils/dtos';
import { ResponseRefParamDto } from 'src/shared/reference-types/dtos/ref-param/response-ref-param.dto';
import { RegionService } from './region.service';

@ApiTags('reference-impl')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: '1',
  path: '/reference-impl',
})
export class RefImplementationController {
  constructor(private readonly regionService: RegionService) {}

  @Get('regions')
  async getAllRegions(): Promise<ResponseRefParamDto[]> {
    return toDtoArray(
      ResponseRefParamDto,
      await this.regionService.getRegionParams(),
    );
  }
}
