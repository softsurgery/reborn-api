import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobCategoryService } from 'src/modules/job-management/services/job-category.service';
import { jobCategoriesSeed } from './data/job-categories.data';

@Injectable()
export class JobCategoriesSeedCommand {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @Command({
    command: 'seed:job-categories',
    describe: 'seed system job categories',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of job categories...');
    //=============================================================================================
    await this.jobCategoryService.findAll({});
    const existingCategories = await this.jobCategoryService.findAll({});
    if (existingCategories.length) {
      console.log('⚠️ Job categories already exist. Seed aborted.');
      return;
    }
    await this.jobCategoryService.saveMany(
      jobCategoriesSeed.map((category) => ({ label: category })),
    );
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
