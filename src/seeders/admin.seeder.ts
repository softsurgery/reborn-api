import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user-management/repositories/user.repository';
import { Gender } from 'src/modules/user-management/enums/gender.enum';
import { BasicRoles } from 'src/modules/user-management/enums/basic-roles.enum';
import { ProfileRepository } from 'src/modules/user-management/repositories/profile.repository';
import { UserService } from 'src/modules/user-management/services/user.service';

@Injectable()
export class AdminSeedCommand {
  constructor(
    private readonly userservice: UserService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  @Command({
    command: 'seed:admin',
    describe: 'seed system admin',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of admin...');
    //=============================================================================================

    let adminUser = await this.userRepository.findOne({
      where: { username: 'superadmin' },
    });

    if (!adminUser) {
      const profile = await this.profileRepository.save({
        phone: '+33123456789',
        cin: '123456789',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        gender: Gender.Male,
        isPrivate: false,
      });

      adminUser = await this.userservice.save({
        id: 'superadmin',
        firstName: 'SUPER$',
        lastName: 'SUPER$',
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: 'superpassword',
        roleId: BasicRoles.Admin,
        isActive: true,
        isApproved: true,
        profileId: profile.id,
      });
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
