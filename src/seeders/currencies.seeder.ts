import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { currenciesSeed } from './data/currencies.data';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';

@Injectable()
export class CurrenciesSeedCommand {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:currencies',
    describe: 'Seed system currencies',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of currencies...');
    //=============================================================================================
    let currencyRefType = await this.refTypeRepository.findOne({
      where: { label: 'Currency' },
    });

    if (!currencyRefType) {
      currencyRefType = await this.refTypeRepository.save({
        label: 'Currency',
        description: 'Parent reference type for all currencies',
      });
      for (const currency of currenciesSeed) {
        await this.refParamRepository.save({
          label: currency.label,
          description: currency.label,
          refType: currencyRefType,
          extras: {
            code: currency.code,
            digitsAfterComma: currency.digitsAfterComma,
            symbol: currency.symbol,
          },
        });
      }
    }
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
