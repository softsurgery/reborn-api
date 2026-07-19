import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionsSeedCommand } from './permissions.seeder';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { TemplateModule } from 'src/shared/templates/template.module';
import { TemplatesSeedCommand } from './templates.seeder';
import { RegionsSeedCommand } from './region.seeder';
import { CurrenciesSeedCommand } from './currencies.seeder';
import { PlaygroundUsersSeedCommand } from './playground/users.seeder';
import { JobCategoriesSeedCommand } from './job-categories.seeder';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';
import { PlaygroundJobsSeedCommand } from './playground/job.seeder';
import { JobTagsSeedCommand } from './job-tags.seeder';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { SkillsSeedCommand } from './skills.seeder';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ResetProjectSeedCommand } from './reset.seeder';
import { PublicResourceSeedCommand } from './public-resource.seeder';
import { StorageFolderSeedCommand } from './storage-folder.seeder';
import { StorageModule } from 'src/shared/storage/storage.module';
import { AppStorageFolderModule } from 'src/app/app-storage-folder.module';
import { ConfigurationSeedCommand } from './configuration.seeder';
import { ConfigurationsModule } from 'src/shared/configurations/configurations.module';

@Module({
  providers: [
    //seeders
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    TemplatesSeedCommand,
    RegionsSeedCommand,
    CurrenciesSeedCommand,
    JobCategoriesSeedCommand,
    JobTagsSeedCommand,
    SkillsSeedCommand,
    ResetProjectSeedCommand,
    PublicResourceSeedCommand,
    StorageFolderSeedCommand,
    ConfigurationSeedCommand,
    //playground
    PlaygroundUsersSeedCommand,
    PlaygroundJobsSeedCommand,
  ],
  imports: [
    CommandModule,
    UserManagementModule,
    TemplateModule,
    JobManagementModule,
    ReferenceTypesModule,
    DatabaseModule,
    StorageModule,
    AppStorageFolderModule,
    ConfigurationsModule,
  ],
})
export class SeedersModule {}
