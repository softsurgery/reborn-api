import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FinanceService } from 'src/modules/finance/services/finance.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { AdvancedRequest } from 'src/types';

@Controller('finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('balance')
  getBalance(@Req() req: AdvancedRequest) {
    if (!req.user) throw new UserNotFoundException();
    return this.financeService.findUserBalance(req.user.sub);
  }

  @Get('transactions')
  getTransactions(@Req() req: AdvancedRequest, @Query() query: IQueryObject) {
    if (!req.user) throw new UserNotFoundException();
    return this.financeService.getTransactions(req.user.sub, query);
  }
}
