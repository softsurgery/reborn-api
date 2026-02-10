import { registerAs } from '@nestjs/config';

import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues: Record<string, string>) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues: Record<string, string>) => !envValues.DATABASE_TYPE)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((envValues: Record<string, string>) => !envValues.DATABASE_HOST)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues: Record<string, string>) => !envValues.DATABASE_PORT)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf(
    (envValues: Record<string, string>) => !envValues.DATABASE_PASSWORD,
  )
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((envValues: Record<string, string>) => !envValues.DATABASE_NAME)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf(
    (envValues: Record<string, string>) => !envValues.DATABASE_USERNAME,
  )
  @IsString()
  DATABASE_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_DROP_SCHEMA: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export default registerAs('database', (): Record<string, unknown> => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 3306,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: process.env.DATABASE_DROP_SCHEMA === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };
});
