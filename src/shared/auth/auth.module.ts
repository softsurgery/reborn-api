import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { StoreModule } from '../store/store.module';
import { MailModule } from '../mail/mail.module';
import { ClientAuthService } from './services/client-auth.service';

@Module({
  imports: [UserManagementModule, ConfigModule, StoreModule, MailModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    ClientAuthService,
  ],
  exports: [AuthService, ClientAuthService],
})
export class AuthModule {}
