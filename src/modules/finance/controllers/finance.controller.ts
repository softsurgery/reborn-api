import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PointsService } from 'src/modules/finance/services/points.service';
import { FundsService } from 'src/modules/finance/services/funds.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { AdvancedRequest } from 'src/types';
import { BalanceResponseDto } from 'src/modules/finance/dtos/balance-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { TransactionRequestDto } from '../dtos/transaction-request.dto';
import { TransactionType } from '../enums/transaction-type.enum';

@Controller('finance')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
export class FinanceController {
  constructor(
    private readonly pointsService: PointsService,
    private readonly fundsService: FundsService,
  ) {}

  @Get('balance')
  async getBalance(@Req() req: AdvancedRequest): Promise<BalanceResponseDto> {
    if (!req.user) throw new UserNotFoundException();
    const balance = await this.fundsService.findUserBalance(req.user.sub);
    if (!balance) throw new UserNotFoundException();
    return balance;
  }

  @Get('transactions')
  getTransactions(@Req() req: AdvancedRequest, @Query() query: IQueryObject) {
    if (!req.user) throw new UserNotFoundException();
    return this.pointsService.getTransactions(req.user.sub, query);
  }

  @Get('fund-transactions')
  getFundTransactions(
    @Req() req: AdvancedRequest,
    @Query() query: IQueryObject,
  ) {
    if (!req.user) throw new UserNotFoundException();
    return this.fundsService.getFundTransactions(req.user.sub, query);
  }

  @Post('top-up-funds')
  async topUpFunds(
    @Req() req: AdvancedRequest,
    @Body() body: TransactionRequestDto,
  ) {
    if (!req.user) throw new UserNotFoundException();
    await this.fundsService.addFunds(
      req.user.sub,
      body.amount,
      TransactionType.BOUGHT_VIA_CREDIT_CARD,
      { title: 'Wallet Top Up' },
    );
    return { success: true };
  }

  @Post('top-up-points')
  async topUpPoints(
    @Req() req: AdvancedRequest,
    @Body() body: TransactionRequestDto,
  ) {
    if (!req.user) throw new UserNotFoundException();
    await this.pointsService.addPoints(
      req.user.sub,
      body.amount,
      TransactionType.BOUGHT_VIA_CREDIT_CARD,
      { title: 'Points Top Up' },
    );
    return { success: true };
  }
}
