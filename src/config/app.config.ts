import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, unknown> => ({
    name: process.env.APP_NAME ?? 'Reborn API Server',
    globalPrefix: '/api',
    http: {
      enable: process.env.HTTP_ENABLE === 'true',
      host: process.env.APP_HOST ?? 'localhost',
      port: process.env.APP_PORT ? Number.parseInt(process.env.APP_PORT) : 5000,
    },

    jobEnable: process.env.JOB_ENABLE === 'true',
    uploadPath: process.env.UPLOAD_PATH ?? '/upload',

    jwt: {
      secret: process.env.JWT_SECRET ?? 'secret',
      accessExpiration: process.env.JWT_ACCESS_EXPIRATION ?? '1d',
      refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '3d',
    },
  }),
);
