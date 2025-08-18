import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region/entities/region.entity';
import { RegionService } from './region/services/region.service';
import { RegionRepository } from './region/repositories/region.repository';
import { CurrencyRepository } from './currency/repositories/currency.repository';
import { CurrencyService } from './currency/services/currency.service';
import { CurrencyEntity } from './currency/entities/currency.entity';

@Module({
  controllers: [],
  providers: [
    RegionRepository,
    CurrencyRepository,
    RegionService,
    CurrencyService,
  ],
  exports: [RegionService, CurrencyService],
  imports: [TypeOrmModule.forFeature([RegionEntity, CurrencyEntity])],
})
export class ContentModule {}
