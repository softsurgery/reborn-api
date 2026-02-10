import { Module } from '@nestjs/common';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { RegionService } from './region.service';

@Module({
  controllers: [],
  providers: [RegionService],
  exports: [RegionService],
  imports: [ReferenceTypesModule],
})
export class ReferenceImplModule {}
