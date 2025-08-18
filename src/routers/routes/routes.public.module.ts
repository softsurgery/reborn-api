import { Module } from '@nestjs/common';
import { ContentModule } from 'src/modules/content/content.module';
import { CurrencyController } from 'src/modules/content/currency/controllers/currency.controller';
import { RegionController } from 'src/modules/content/region/controllers/region.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [RegionController, CurrencyController],
  providers: [],
  exports: [],
  imports: [ContentModule, LoggerModule],
})
export class RoutesPublicModule {}
