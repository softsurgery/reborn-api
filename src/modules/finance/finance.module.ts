import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsService } from './services/points.service';
import { FundsService } from './services/funds.service';
import { PointTransactionEntity } from './entities/point-transaction.entity';
import { PointTransactionRepository } from './repositories/point-transaction.repository';
import { FundTransactionEntity } from './entities/fund-transaction.entity';
import { FundTransactionRepository } from './repositories/fund-transaction.repository';
import { UserManagementModule } from '../users/user-management.module';

@Module({
  providers: [
    PointsService,
    FundsService,
    PointTransactionRepository,
    FundTransactionRepository,
  ],
  exports: [PointsService, FundsService],
  imports: [
    TypeOrmModule.forFeature([PointTransactionEntity, FundTransactionEntity]),
    UserManagementModule,
  ],
})
export class FinanceModule {}
