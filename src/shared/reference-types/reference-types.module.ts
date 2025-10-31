import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefTypeRepository } from './repositories/ref-type.repository';
import { RefParamRepository } from './repositories/ref-param.repository';
import { RefTypeService } from './services/ref-type.service';
import { RefParamService } from './services/ref-param.service';
import { RefTypeEntity } from './entities/ref-type.entity';
import { RefParamEntity } from './entities/ref-param.entity';

@Module({
  controllers: [],
  providers: [
    RefTypeRepository,
    RefParamRepository,
    RefTypeService,
    RefParamService,
  ],
  exports: [
    RefTypeRepository,
    RefParamRepository,
    RefTypeService,
    RefParamService,
  ],
  imports: [TypeOrmModule.forFeature([RefTypeEntity, RefParamEntity])],
})
export class ReferenceTypesModule {}
