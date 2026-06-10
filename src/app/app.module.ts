import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/shared/database/services/database-config.service';
import { ClsModule } from 'nestjs-cls';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolveMX } from 'src/shared/mail/utils/mx-resolve.util';
import { MailModule } from 'src/shared/mail/mail.module';
import { SeedersModule } from 'src/seeders/seeders.module';
import { RouterModule } from 'src/routers/router.module';
import { ChatModule } from 'src/shared/chat/chat.module';
import { StorageModule } from 'src/shared/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      cache: true,
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: DataSource,
          }),
        }),
      ],
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => {
        try {
          const email = process.env.SMTP_USER;
          if (!email) throw new Error('SMTP_USER is not set');

          let host = process.env.SMTP_HOST;
          let port = Number(process.env.SMTP_PORT);
          const domain = process.env.SMTP_HOST || '';
          if (!host) {
            const resolvedMx = await resolveMX(domain);
            host = resolvedMx.host;
            port = resolvedMx.port;
          }
          return {
            transport: {
              host,
              port,
              secure: process.env.SMTP_SECURE === 'true',
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
              tls: {
                rejectUnauthorized:
                  process.env.SMTP_REJECT_UNAUTHORIZED === 'true',
              },
            },
            defaults: {
              from: `"No Reply" <${process.env.SMTP_USER}>`,
            },
          };
        } catch (error: unknown) {
          const errMsg = error instanceof Error ? error.message : String(error);
          console.error('⚠️ Failed to configure mailer:', errMsg);

          // Return a "disabled" mailer config to prevent startup crash
          return {
            transport: {
              jsonTransport: true, // mailer will just log messages instead of sending
            },
            defaults: {
              from: '"Mail Disabled" <noreply@example.com>',
            },
          };
        }
      },
    }),
    MailModule,
    SeedersModule,
    RouterModule.forRoot(),
    ChatModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
