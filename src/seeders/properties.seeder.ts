import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { StoreService } from 'src/shared/store/services/store.service';
import { propertiesCoreSeed, propertiesFaqsSeed } from './data/properties.data';

@Injectable()
export class PropertiesSeedCommand {
  constructor(private readonly storeService: StoreService) {}

  @Command({
    command: 'seed:properties',
    describe: 'Seed properties',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of properties...');
    //=============================================================================================
    await this.storeService.saveMany([
      {
        id: 'core',
        description: 'Core company information',
        value: propertiesCoreSeed,
      },
      {
        id: 'faqs',
        description: 'Frequently Asked Questions',
        value: propertiesFaqsSeed,
      },
    ]);
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
