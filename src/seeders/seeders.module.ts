import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeedCommand } from './permissions.seeder';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { TemplateModule } from 'src/shared/templates/template.module';
import { TemplatesSeedCommand } from './templates.seeder';
import { RegionsSeedCommand } from './region.seeder';
import { ContenttModule } from 'src/modules/content/content.module';

@Module({
  imports: [
    CommandModule,
    UserManagementModule,
    TemplateModule,
    ContenttModule,
  ],
  providers: [
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    TemplatesSeedCommand,
    RegionsSeedCommand,
  ],
})
export class SeedersModule {}
