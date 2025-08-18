import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeedCommand } from './permissions.seeder';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { TemplateModule } from 'src/shared/templates/template.module';
import { TemplatesSeedCommand } from './templates.seeder';
import { RegionsSeedCommand } from './region.seeder';
import { ContentModule } from 'src/modules/content/content.module';
import { PropertiesSeedCommand } from './properties.seeder';
import { StoreModule } from 'src/shared/store/store.module';
import { CurrenciesSeedCommand } from './currencies.seeder';

@Module({
  imports: [
    CommandModule,
    UserManagementModule,
    TemplateModule,
    ContentModule,
    StoreModule,
  ],
  providers: [
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    TemplatesSeedCommand,
    RegionsSeedCommand,
    PropertiesSeedCommand,
    CurrenciesSeedCommand,
  ],
})
export class SeedersModule {}
