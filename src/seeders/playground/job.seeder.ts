import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobService } from 'src/modules/job-management/services/job.service';
import { mockJobsSeed } from '../data/playground-jobs.data';
import { JobStyle } from 'src/modules/job-management/enums/job-style.enum';
import { JobDifficulty } from 'src/modules/job-management/enums/job-difficulty.enum';
import { JobStatus } from 'src/modules/job-management/enums/workflow/job-status.enum';
import { JobPricingType } from 'src/modules/job-management/enums/job-pricing-type.enum';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { UserService } from 'src/modules/users/services/user.service';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { downloadAndStoreImagesForJob } from './job-upslash-downloader';

@Injectable()
export class PlaygroundJobsSeedCommand {
  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly refParamRepository: RefParamRepository,
    private readonly storageService: StorageService,
  ) {}

  @Command({
    command: 'seed:playground-jobs',
    describe: 'seed playground jobs with Unsplash random images',
  })
  async seed() {
    const start = new Date();
    console.log(
      '🚀 Starting seeding of playground jobs with Unsplash images...',
    );
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

    let jobIndex = 0;
    for (const job of mockJobsSeed) {
      jobIndex++;
      const tagsCount = Math.floor(Math.random() * jobTags.length) + 1;

      const shuffledTags = [...jobTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, tagsCount);
      const tagIds = selectedTags.map((t) => t.id);

      const imageCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 images per job
      const uploadedImages = await downloadAndStoreImagesForJob(
        job.category,
        job.title,
        imageCount,
        this.storageService,
      );

      const defaultLat = 37.7749 + (Math.random() - 0.5) * 0.1;
      const defaultLng = -122.4194 + (Math.random() - 0.5) * 0.1;

      await this.jobService.extendedSave(
        {
          title: job.title,
          description: job.description,
          price: job.price,
          status: JobStatus.POSTED,
          pricingType:
            Math.random() > 0.5 ? JobPricingType.FIXED : JobPricingType.HOURLY,
          uploads: uploadedImages,
          currencyId:
            currencies[Math.floor(Math.random() * currencies.length)].id,
          categoryId:
            jobCategories[
              jobCategories.findIndex((cat) => cat.label === job.category)
            ]?.id || jobCategories[0].id,
          style:
            JobStyle[
              Object.keys(JobStyle)[
                Math.floor(Math.random() * Object.keys(JobStyle).length)
              ] as keyof typeof JobStyle
            ],
          difficulty:
            JobDifficulty[
              Object.keys(JobDifficulty)[
                Math.floor(Math.random() * Object.keys(JobDifficulty).length)
              ] as keyof typeof JobDifficulty
            ],
          latitude:
            'latitude' in job && job.latitude ? job.latitude : defaultLat,
          longitude:
            'longitude' in job && job.longitude ? job.longitude : defaultLng,
        },
        tagIds,
        users[Math.floor(Math.random() * users.length)].id,
      );

      console.log(
        `[${jobIndex}/${mockJobsSeed.length}] ✅ Seeded job: "${job.title}" (${uploadedImages.length} images attached)`,
      );
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️ (${mockJobsSeed.length} jobs seeded)`,
    );
  }
}
