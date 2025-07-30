import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { StoreService } from '../services/store.service';
import { StoreEntity } from '../entites/store.entity';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';

@ApiTags('store')
@Controller({
  version: '1',
  path: '/store',
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/list')
  @ApiPaginatedResponse(StoreEntity)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<StoreEntity>> {
    return this.storeService.findAllPaginated(query);
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<StoreEntity[]> {
    return this.storeService.findAll(options);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<StoreEntity | null> {
    return this.storeService.findOneById(id);
  }
}
