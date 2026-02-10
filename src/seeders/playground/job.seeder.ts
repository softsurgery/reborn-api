import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobService } from 'src/modules/job-management/services/job.service';
import { mockJobsSeed } from '../data/playground-jobs.data';
import { JobStyle } from 'src/modules/job-management/enums/job-style.enum';
import { JobDifficulty } from 'src/modules/job-management/enums/job-difficulty.enum';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class PlaygroundJobsSeedCommand {
  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:playground-jobs',
    describe: 'seed playground jobs',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of playground jobs...');
    //=============================================================================================
    const currencies = await this.refParamRepository.findAll({
      where: { refType: { label: 'Currency' } },
    });
    const jobCategories = await this.refParamRepository.findAll({
      where: { refType: { label: 'Job Category' } },
    });
    const jobTags = await this.refParamRepository.findAll({
      where: { refType: { label: 'Job Tag' } },
    });
    const users = await this.userService.findAll({});

    if (
      !currencies.length ||
      !jobCategories.length ||
      !users.length ||
      !jobTags
    ) {
      console.log(
        '⚠️ No currencies, job categories, or users found. Seed aborted.',
      );
      return;
    }

    for (const job of mockJobsSeed) {
      // number of tags to pick for this job
      const tagsCount = Math.floor(Math.random() * jobTags.length) + 1;

      // shuffle jobTags and pick first N
      const shuffledTags = [...jobTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, tagsCount);
      const tagIds = selectedTags.map((t) => t.id);

      await this.jobService.saveJob(
        {
          title: job.title,
          description: job.description,
          price: job.price,
          uploads: [],
          currencyId:
            currencies[Math.floor(Math.random() * currencies.length)].id,
          categoryId:
            jobCategories[
              jobCategories.findIndex((cat) => cat.label === job.category)
            ]?.id,
          tagIds,
          style:
            JobStyle[
              Object.keys(JobStyle)[
                Math.floor(Math.random() * Object.keys(JobStyle).length)
              ]
            ],
          difficulty:
            JobDifficulty[
              Object.keys(JobDifficulty)[
                Math.floor(Math.random() * Object.keys(JobDifficulty).length)
              ]
            ],
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
