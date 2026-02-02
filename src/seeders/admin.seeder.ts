import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { adminSeed } from './data/admin.data';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class AdminSeedCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'seed:admin',
    describe: 'seed system admin',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of admin...');
    //=============================================================================================

    const adminUser = await this.userService.findOneByUsername({
      where: { username: 'superadmin' },
    });

    if (!adminUser) {
      await this.userService.extendedSave({
        ...adminSeed.core,
        ...adminSeed.profile,
      });
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
