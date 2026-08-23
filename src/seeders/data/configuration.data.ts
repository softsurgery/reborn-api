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

export const financialConfiguration = [
  {
    name: 'points.maxFree',
    description: 'Max points a person can get in free mode',
    variant: ParamVariant.NUMBER,
    value: '100',
  },
  {
    name: 'points.maxPaid',
    description: 'Max points a person can get in paid mode',
    variant: ParamVariant.NUMBER,
    value: '1000',
  },
  {
    name: 'balance.max',
    description: 'Maximum allowed balance',
    variant: ParamVariant.NUMBER,
    value: '10000',
  },
];
