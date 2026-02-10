import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('database.type', { infer: true }),
      url: this.configService.get<string>('database.url', { infer: true }),
      host: this.configService.get<string>('database.host', { infer: true }),
      port: this.configService.get<string>('database.port', { infer: true }),
      username: this.configService.get<string>('database.username', {
        infer: true,
      }),
      password: this.configService.get<string>('database.password', {
        infer: true,
      }),
      database: this.configService.get<string>('database.name', {
        infer: true,
      }),
      synchronize: this.configService.get<string>('database.synchronize', {
        infer: true,
      }),
      dropSchema: this.configService.get<string>('database.dropSchema', {
        infer: true,
      }),
      keepConnectionAlive: true,
      logging: this.configService.get<string>('database.logging', {
        infer: true,
      }),
      entities: [
        __dirname + '/../../**/*.entity{.ts,.js}',
        __dirname + '/../../../modules/**/*.entity{.ts,.js}',
      ],
      extra: {
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get<string>(
                'database.rejectUnauthorized',
                { infer: true },
              ),
              ca:
                this.configService.get<string>('database.ca', {
                  infer: true,
                }) ?? undefined,
              key:
                this.configService.get<string>('database.key', {
                  infer: true,
                }) ?? undefined,
              cert:
                this.configService.get<string>('database.cert', {
                  infer: true,
                }) ?? undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
