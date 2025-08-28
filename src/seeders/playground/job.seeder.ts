import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobService } from 'src/modules/job-management/services/job.service';
import { CurrencyService } from 'src/modules/content/currency/services/currency.service';
import { JobCategoryService } from 'src/modules/job-management/services/job-category.service';
import { mockJobsSeed } from '../data/playground-jobs.data';
import { UserService } from 'src/modules/user-management/services/user.service';

@Injectable()
export class PlaygroundJobsSeedCommand {
  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly currencyService: CurrencyService,
    private readonly jobCategoryService: JobCategoryService,
  ) {}

  @Command({
    command: 'seed:playground-jobs',
    describe: 'seed playground jobs',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of playground jobs...');
    //=============================================================================================
    const currencies = await this.currencyService.findAll({});
    const jobCategories = await this.jobCategoryService.findAll({});
    const users = await this.userService.findAll({});

    if (!currencies.length || !jobCategories.length || !users.length) {
      console.log(
        '⚠️ No currencies, job categories, or users found. Seed aborted.',
      );
      return;
    }

    for (const job of mockJobsSeed) {
      await this.jobService.saveJob(
        {
          title: job.title,
          description: job.description,
          price: job.price,
          tagIds: [],
          uploads: [],
          currencyId:
            currencies[Math.floor(Math.random() * currencies.length)].id,
          categoryId:
            jobCategories[
              jobCategories.findIndex((cat) => cat.label === job.category)
            ]?.id,
        },
        users[Math.floor(Math.random() * users.length)].id,
      );
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
