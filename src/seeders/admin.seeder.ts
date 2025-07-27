import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleService } from 'src/modules/user-management/services/role.service';
import { UserService } from 'src/modules/user-management/services/user.service';
import { UserRepository } from 'src/modules/user-management/repositories/user.repository';

@Injectable()
export class AdminSeedCommand {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Command({
    command: 'seed:admin',
    describe: 'seed system admin',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of admin...');
    //=============================================================================================

    const adminRole = await this.roleService.findOneById('Admin');
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    let adminUser = await this.userRepository.findOne({
      where: { username: 'superadmin' },
    });
    if (!adminUser)
      adminUser = await this.userService.save({
        firstName: 'SUPER$',
        lastName: 'SUPER$',
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: 'superpassword',
        roleId: adminRole?.id,
        isActive: true,
        isApproved: true,
      });

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
