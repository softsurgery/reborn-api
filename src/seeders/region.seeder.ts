import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { tunisianGovernoratesSeed } from './data/region.data';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';

@Injectable()
export class RegionsSeedCommand {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:regions',
    describe: 'seed system regions',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of regions...');
    //=============================================================================================
    let regionRefType = await this.refTypeRepository.findOneById('region');

    if (!regionRefType) {
      regionRefType = await this.refTypeRepository.save({
        id: 'region',
        label: 'Region',
        description: 'Parent reference type for all regions',
      });
      for (const region of tunisianGovernoratesSeed) {
        await this.refParamRepository.save({
          label: region,
          description: `This is a ${region} reference param`,
          refType: regionRefType,
          extras: {},
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
