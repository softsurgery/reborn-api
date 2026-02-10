import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { mockUsersSeed } from '../data/playground-users.data';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class PlaygroundUsersSeedCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'seed:playground-users',
    describe: 'seed playground users',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of playground users...');
    //=============================================================================================

    for (const user of mockUsersSeed) {
      const exists = await this.userService.findOneByUsername(
        user.core.username,
      );

      if (!exists) {
        await this.userService.extendedSave({
          ...user.core,
          ...user.profile,
        });
        console.log(`✅ Created user: ${user.core.username}`);
      } else {
        console.log(`⚠️ User already exists: ${user.core.username}`);
      }
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
