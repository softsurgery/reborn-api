import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(
  dtoClass: new (...args: unknown[]) => T,
  plainObject: V,
): T {
  return plainToInstance(dtoClass, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function toDtoArray<T, V>(dto: new () => T, plain: V[]): T[] {
  return plainToInstance(dto, plain, { excludeExtraneousValues: true });
}
