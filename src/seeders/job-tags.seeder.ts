import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { jobTagsSeed } from './data/job-tags.data';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';

@Injectable()
export class JobTagsSeedCommand {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:job-tags',
    describe: 'seed system job tags',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of job tags...');
    //=============================================================================================
    let jobTagsRefType = await this.refTypeRepository.findOne({
      where: { label: 'Job Tag' },
    });
    if (!jobTagsRefType) {
      jobTagsRefType = await this.refTypeRepository.save({
        label: 'Job Tag',
        description: 'Parent reference type for job tags',
      });
    }

    for (const jobTag of jobTagsSeed) {
      await this.refParamRepository.save({
        label: jobTag,
        description: `This is a ${jobTag} ref param`,
        refType: jobTagsRefType,
        extras: {},
      });
    }
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
