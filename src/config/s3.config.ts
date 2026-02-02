import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  driver: process.env.STORAGE_DRIVER ?? 'local',
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION ?? 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
}));
