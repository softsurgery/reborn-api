import { ParamVariant } from 'src/shared/configurations/enums/param-variant.enum';

export const coreConfiguration = [
  {
    name: 'company.name',
    description: 'Company name',
    variant: ParamVariant.STRING,
    value: 'SUPER COMPANY',
  },
  {
    name: 'company.support',
    description: 'Company support email',
    variant: ParamVariant.STRING,
    value: 'support@super.company',
  },
  {
    name: 'company.address',
    description: 'Company address',
    variant: ParamVariant.STRING,
    value: '123 Main Street, Anytown',
  },
];
