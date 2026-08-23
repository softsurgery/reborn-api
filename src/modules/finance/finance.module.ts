import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './services/finance.service';
import { PointTransactionEntity } from './entities/point-transaction.entity';
import { PointTransactionRepository } from './repositories/point-transaction.repository';
import { UserManagementModule } from '../users/user-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointTransactionEntity]),
    UserManagementModule,
  ],
  providers: [FinanceService, PointTransactionRepository],
  exports: [FinanceService],
})
export class FinanceModule {}
