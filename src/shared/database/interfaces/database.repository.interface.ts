import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  InsertResult,
  ObjectLiteral,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface DatabaseInterfaceRepository<T extends ObjectLiteral> {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T>;
  getRelatedEntityNames(): string[];
  getTotalCount(options: FindOneOptions<T>): Promise<number>;

  findOne(options: FindOneOptions<T>): Promise<T | null>;
  findOneById(id: string): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;

  create(data: DeepPartial<T>): T;
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  upsert(data: T): Promise<InsertResult>;
  upsertMany(data: T[]): Promise<InsertResult[]>;
  preload(entityLike: DeepPartial<T>): Promise<T | undefined>;

  update(
    id: string | number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T | null>;
  updateMany(data: DeepPartial<T>[]): Promise<T[]>;

  remove(data: T): Promise<T>;
  delete(id: string | number): Promise<void>;
  deleteMany(ids: (string | number)[]): Promise<void>;
  deleteAll(): Promise<void>;
  softDelete(id: string | number): Promise<T | null>;
  softDeleteMany(ids: (string | number)[]): Promise<T[]>;

  updateAssociations<
    U extends { id: number | string } & Record<string, unknown>,
  >({
    existingItems,
    updatedItems,
    keys,
    onCreate,
    onDelete,
  }: {
    existingItems: U[];
    updatedItems: U[];
    keys: [keyof U, keyof U];
    onCreate: (item: U) => Promise<U>;
    onDelete: (id: number | string) => Promise<U>;
  }): Promise<{
    keptItems: U[];
    newItems: U[];
    eliminatedItems: U[];
  }>;
}
