import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/shared/abstract-user-management/repositories/role.repository';
import { RolePermissionRepository } from 'src/shared/abstract-user-management/repositories/role-permission.repository';
import { PermissionRepository } from 'src/shared/abstract-user-management/repositories/permission.repository';

@Injectable()
export class RolesSeedCommand {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  @Command({
    command: 'seed:roles',
    describe: 'seed system roles',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of roles...');
    //=============================================================================================
    const permissions = await this.permissionRepository.findAll();

    await this.roleRepository.saveMany([
      {
        id: 'Admin',
        label: 'Admin',
        description: 'Administrator role',
      },
      {
        id: 'User',
        label: 'User',
        description: 'User role',
      },
    ]);

    const existings = await this.rolePermissionRepository.findAll({
      where: { roleId: 'Admin' },
    });

    await this.rolePermissionRepository.deleteMany(existings.map((e) => e.id));

    await this.rolePermissionRepository.saveMany(
      permissions.map((p) => ({
        roleId: 'Admin',
        permissionId: p.id,
      })),
    );

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
