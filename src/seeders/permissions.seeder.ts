import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/modules/user-management/services/permission.service';
import {
  permissionActionsSeed,
  permissionEntitiesSeed,
} from './data/permissions.data';

@Injectable()
export class PermissionsSeedCommand {
  constructor(private readonly permissionService: PermissionService) {}

  @Command({
    command: 'seed:permissions',
    describe: 'Seed system permissions',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of permissions...');
    //=============================================================================================

    await this.permissionService.saveMany(
      permissionEntitiesSeed.flatMap((entity) => {
        return permissionActionsSeed.map((action) => {
          const id = `${action.toUpperCase()}_${entity.toUpperCase()}`;

          const label = id;
          const description = `Can ${action} ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;

          return {
            id,
            label,
            description,
          };
        });
      }),
    );
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
