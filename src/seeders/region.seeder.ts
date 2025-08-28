import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RegionService } from 'src/modules/content/region/services/region.service';
import { tunisianGovernoratesSeed } from './data/region.data';

@Injectable()
export class RegionsSeedCommand {
  constructor(private readonly regionService: RegionService) {}

  @Command({
    command: 'seed:regions',
    describe: 'seed system regions',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of regions...');
    //=============================================================================================

    await this.regionService.saveMany(
      tunisianGovernoratesSeed.map((region) => ({
        label: region,
      })),
    );
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
