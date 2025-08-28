import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user-management/repositories/user.repository';
import { ProfileRepository } from 'src/modules/user-management/repositories/profile.repository';
import { UserService } from 'src/modules/user-management/services/user.service';
import { mockUsersSeed } from '../data/playground-users.data';

@Injectable()
export class PlaygroundUsersSeedCommand {
  constructor(
    private readonly userservice: UserService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  @Command({
    command: 'seed:playground-users',
    describe: 'seed playground users',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of playground users...');
    //=============================================================================================

    for (const user of mockUsersSeed) {
      const exists = await this.userRepository.findOne({
        where: { username: user.core.username },
      });

      if (!exists) {
        const profile = await this.profileRepository.save(user.profile);
        await this.userservice.save({
          ...user.core,
          profileId: profile.id,
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
