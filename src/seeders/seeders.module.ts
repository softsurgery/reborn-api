import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeedCommand } from './permissions.seeder';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { TemplateModule } from 'src/shared/templates/template.module';
import { TemplatesSeedCommand } from './templates.seeder';

@Module({
  imports: [CommandModule, UserManagementModule, TemplateModule],
  providers: [
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    TemplatesSeedCommand,
  ],
})
export class SeedersModule {}
