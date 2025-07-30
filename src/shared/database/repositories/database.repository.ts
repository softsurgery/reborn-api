import {
  DeepPartial,
  EntityMetadata,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  InsertResult,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DatabaseInterfaceRepository } from '../interfaces/database.repository.interface';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';

export abstract class DatabaseAbstractRepository<T extends ObjectLiteral>
  implements DatabaseInterfaceRepository<T>
{
  protected txHost?: TransactionHost<TransactionalAdapterTypeOrm>;

  protected constructor(
    protected readonly entity: Repository<T>,
    txHost?: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    this.txHost = txHost;
  }

  private getRepository(): Repository<T> {
    return this.txHost?.tx?.getRepository(this.entity.target) || this.entity;
  }

  public getMetadata(): EntityMetadata {
    return this.getRepository().metadata;
  }

  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.getRepository().createQueryBuilder(alias, queryRunner);
  }

  public getRelatedEntityNames(): string[] {
    return this.getRepository()
      .metadata.relations.filter(
        (relation) =>
          relation.isManyToOne || relation.isOneToOne || relation.isManyToMany,
      )
      .map((relation) => relation.propertyName);
  }

  public async getTotalCount(options: FindOneOptions<T> = {}): Promise<number> {
    return this.getRepository().count(options);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.getRepository().findOne(options);
  }

  public async findOneById(id: string | number): Promise<T | null> {
    const options: FindOptionsWhere<T> = {
      id: id,
    } as unknown as FindOptionsWhere<T>;
    return this.getRepository().findOneBy(options);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.getRepository().find(options);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.getRepository().find(relations);
  }

  public create(data: DeepPartial<T>): T {
    return this.getRepository().create(data);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return this.getRepository().save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.getRepository().save(data);
  }

  public async upsert(data: Partial<T>): Promise<InsertResult> {
    return this.getRepository().upsert(data, ['id']);
  }

  public async upsertMany(data: Partial<T>[]): Promise<InsertResult[]> {
    return Promise.all(data.map(async (item) => await this.upsert(item)));
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
    return this.getRepository().preload(entityLike);
  }

  public async update(
    id: string | number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    const updated = await this.getRepository().update(id, data);

    if (!updated) {
      throw new NotFoundException();
    }

    return this.findOneById(id);
  }

  public async updateMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.getRepository().save(data);
  }

  public async remove(data: T): Promise<T> {
    return this.getRepository().remove(data);
  }

  public async delete(id: string | number): Promise<void> {
    await this.getRepository().delete(id);
  }

  public async deleteMany(ids: (string | number)[]): Promise<void> {
    await Promise.all(ids.map((id) => this.getRepository().delete(id)));
  }

  public async deleteAll(): Promise<void> {
    await this.getRepository().clear();
  }

  public async softDelete(id: string | number): Promise<T | null> {
    const deleted = await this.getRepository().softDelete(id);
    if (!deleted) {
      throw new NotFoundException();
    }
    return this.findOneById(id);
  }

  public async softDeleteMany(ids: (string | number)[]): Promise<T[]> {
    const options: FindManyOptions<T> = {
      id: In(ids),
    } as unknown as FindManyOptions<T>;

    const entities = await this.findAll(options);

    await Promise.all(
      ids.map(async (id) => {
        return this.getRepository().softDelete(id);
      }),
    );

    return entities;
  }

  async updateAssociations<
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
    onDelete: (id: number | string) => Promise<U | null>;
  }): Promise<{
    keptItems: U[];
    newItems: U[];
    eliminatedItems: U[];
  }> {
    const keptItems: U[] = [];
    const newItems: U[] = [];
    const eliminatedItems: U[] = [];

    const [key1, key2] = keys;

    const match = (a: U, b: U) => a[key1] === b[key1] && a[key2] === b[key2];

    // Delete stale items
    for (const existing of existingItems) {
      const stillExists = updatedItems.some((updated) =>
        match(existing, updated),
      );
      if (stillExists) {
        keptItems.push(existing);
      } else {
        const deleted = await onDelete(existing.id);
        if (deleted) eliminatedItems.push(deleted);
      }
    }

    // Add new items
    for (const updated of updatedItems) {
      const alreadyExists = existingItems.some((existing) =>
        match(existing, updated),
      );
      if (!alreadyExists) {
        const created = await onCreate(updated);
        newItems.push(created);
      }
    }

    return { keptItems, newItems, eliminatedItems };
  }
}
