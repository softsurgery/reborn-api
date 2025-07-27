import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UserManagementModule, ConfigModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
