import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entites/store.entity';
import { StoreRepository } from './repositories/store.repository';
import { StoreService } from './services/store.service';

@Module({
  controllers: [],
  providers: [StoreRepository, StoreService],
  exports: [StoreRepository, StoreService],
  imports: [TypeOrmModule.forFeature([StoreEntity])],
})
export class StoreModule {}
