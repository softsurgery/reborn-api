import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region/entities/region.entity';
import { RegionService } from './region/services/region.service';
import { RegionRepository } from './region/repositories/region.repository';

@Module({
  controllers: [],
  providers: [RegionRepository, RegionService],
  exports: [RegionService],
  imports: [TypeOrmModule.forFeature([RegionEntity])],
})
export class ContentModule {}
