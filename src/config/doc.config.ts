import { registerAs } from '@nestjs/config';

export default registerAs(
  'doc',
  (): Record<string, unknown> => ({
    name: `${process.env.APP_NAME} Specifications`,
    description: 'Section for describe whole APIs',
    version: '1.0',
    prefix: '/docs',
  }),
);
