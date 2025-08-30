import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobTagService } from 'src/modules/job-management/services/job-tag.service';
import { jobTagsSeed } from './data/job-tags.data';

@Injectable()
export class JobTagsSeedCommand {
  constructor(private readonly jobTagService: JobTagService) {}

  @Command({
    command: 'seed:job-tags',
    describe: 'seed system job tags',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of job tags...');
    //=============================================================================================
    await this.jobTagService.findAll({});
    const existingTags = await this.jobTagService.findAll({});
    if (existingTags.length) {
      console.log('⚠️ Job tags already exist. Seed aborted.');
      return;
    }
    await this.jobTagService.saveMany(
      jobTagsSeed.map((tag) => ({ label: tag })),
    );
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
