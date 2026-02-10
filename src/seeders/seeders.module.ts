import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionsSeedCommand } from './permissions.seeder';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { TemplateModule } from 'src/shared/templates/template.module';
import { TemplatesSeedCommand } from './templates.seeder';
import { RegionsSeedCommand } from './region.seeder';
import { PropertiesSeedCommand } from './properties.seeder';
import { StoreModule } from 'src/shared/store/store.module';
import { CurrenciesSeedCommand } from './currencies.seeder';
import { PlaygroundUsersSeedCommand } from './playground/users.seeder';
import { JobCategoriesSeedCommand } from './job-categories.seeder';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';
import { PlaygroundJobsSeedCommand } from './playground/job.seeder';
import { JobTagsSeedCommand } from './job-tags.seeder';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { SkillsSeedCommand } from './skills.seeder';
import { UserManagementModule } from 'src/modules/users/user-management.module';

@Module({
  providers: [
    //seeders
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    TemplatesSeedCommand,
    RegionsSeedCommand,
    PropertiesSeedCommand,
    CurrenciesSeedCommand,
    JobCategoriesSeedCommand,
    JobTagsSeedCommand,
    SkillsSeedCommand,
    //playground
    PlaygroundUsersSeedCommand,
    PlaygroundJobsSeedCommand,
  ],
  imports: [
    CommandModule,
    UserManagementModule,
    TemplateModule,
    StoreModule,
    JobManagementModule,
    ReferenceTypesModule,
  ],
})
export class SeedersModule {}
