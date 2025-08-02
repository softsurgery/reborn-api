import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RegionService } from 'src/modules/content/region/services/region.service';

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
    const tunisianGovernorates: string[] = [
      'Tunis',
      'Ariana',
      'Ben Arous',
      'Manouba',
      'Nabeul',
      'Zaghouan',
      'Bizerte',
      'Beja',
      'Jendouba',
      'Kef',
      'Siliana',
      'Sousse',
      'Monastir',
      'Mahdia',
      'Kairouan',
      'Kasserine',
      'Sidi Bouzid',
      'Sfax',
      'Gabès',
      'Medenine',
      'Tataouine',
      'Gafsa',
      'Tozeur',
      'Kebili',
    ];
    await this.regionService.saveMany(
      tunisianGovernorates.map((region) => ({
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
