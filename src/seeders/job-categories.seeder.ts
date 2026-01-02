import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { jobCategoriesSeed } from './data/job-categories.data';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';

@Injectable()
export class JobCategoriesSeedCommand {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:job-categories',
    describe: 'seed system job categories',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of job categories...');
    //=============================================================================================
    let jobCategoryRefType = await this.refTypeRepository.findOne({
      where: { label: 'Job Category' },
    });
    if (!jobCategoryRefType) {
      jobCategoryRefType = await this.refTypeRepository.save({
        label: 'Job Category',
        description: 'Parent reference type for all job categories',
      });
      for (const jobCategory of jobCategoriesSeed) {
        await this.refParamRepository.save({
          label: jobCategory,
          description: `This is a ${jobCategory} ref param`,
          refType: jobCategoryRefType,
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
