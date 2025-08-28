import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CurrencyService } from 'src/modules/content/currency/services/currency.service';
import { currenciesSeed } from './data/currencies.data';

@Injectable()
export class CurrenciesSeedCommand {
  constructor(private readonly currencyService: CurrencyService) {}

  @Command({
    command: 'seed:currencies',
    describe: 'Seed system currencies',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of currencies...');
    //=============================================================================================
    await this.currencyService.saveMany(currenciesSeed);
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
