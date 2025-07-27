import { Module } from '@nestjs/common';
import { MigrationService } from './services/database-migration.service';
import { MigrationRepository } from './repositories/migration.repository';
import { MigrationEntity } from './entities/migration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MigrationEntity])],
  providers: [MigrationService, MigrationRepository],
  exports: [MigrationService],
})
export class DatabaseModule {}
