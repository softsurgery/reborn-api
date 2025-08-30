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
import { ChatModule } from 'src/modules/chat/chat.module';

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
        const email = process.env.SMTP_USER;
        if (!email) throw new Error('SMTP_USER is not set');

        const domain = email.split('@')[1];
        if (!domain) throw new Error(`Invalid SMTP_USER: ${email}`);

        const { host, port } = await resolveMX(domain);

        return {
          transport: {
            host,
            port,
            secure: port === 465, // Use secure for 465, STARTTLS for 587
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
    MailModule,
    SeedersModule,
    RouterModule.forRoot(),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
