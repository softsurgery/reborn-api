import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { StoreService } from 'src/shared/store/services/store.service';

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
        value: {
          name: 'SUPER COMPANY',
          support: 'support@super.company',
          address: '123 Main Street, Anytown',
        },
      },
    ]);
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
