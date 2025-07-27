import {
  DeepPartial,
  EntityMetadata,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  InsertResult,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';
import { DatabaseVersioningInterfaceRepository } from '../interfaces/database-versioning.repository.interface';

export abstract class DatabaseVersioningAbstractRepository<
  T extends ObjectLiteral,
> implements DatabaseVersioningInterfaceRepository<T>
{
  protected txHost?: TransactionHost<TransactionalAdapterTypeOrm>;

  protected constructor(
    protected readonly entity: Repository<T>,
    txHost?: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    this.txHost = txHost;
  }

  getRelatedEntityNames(): string[] {
    return this.getMetadata().relations.map((rel) => rel.propertyName);
  }

  private getRepository(): Repository<T> {
    return this.txHost?.tx?.getRepository(this.entity.target) || this.entity;
  }

  public getMetadata(): EntityMetadata {
    return this.getRepository().metadata;
  }

  protected getIdColumn(): string {
    return (
      this.getMetadata().primaryColumns.find(
        (col) => col.propertyName !== 'version',
      )?.propertyName || 'id'
    );
  }

  protected getVersionColumn(): string {
    return 'version';
  }

  protected getIsLatestColumn(): string {
    return 'isLatest';
  }

  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.getRepository().createQueryBuilder(alias, queryRunner);
  }

  public async getTotalCount(options: FindOneOptions<T> = {}): Promise<number> {
    return this.getRepository().count(options);
  }

  public async getTotalCountLatest(
    options: FindOneOptions<T> = {},
  ): Promise<number> {
    const isLatestKey = this.getIsLatestColumn();

    const where = Array.isArray(options.where)
      ? options.where.map((condition) => ({
          ...condition,
          [isLatestKey]: true,
        }))
      : {
          ...(options.where || {}),
          [isLatestKey]: true,
        };

    return this.getRepository().count({
      ...options,
      where: where as FindOptionsWhere<T>,
    });
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.getRepository().findOne(options);
  }

  public async findOneById(id: string | number): Promise<T | null> {
    const where: FindOptionsWhere<T> = {
      [this.getIdColumn()]: id,
      [this.getIsLatestColumn()]: true,
    } as FindOptionsWhere<T>;

    return this.getRepository().findOne({ where });
  }

  public async findOneByVersion(
    id: string | number,
    version: number,
  ): Promise<T | null> {
    const where: FindOptionsWhere<T> = {
      [this.getIdColumn()]: id,
      [this.getVersionColumn()]: version,
    } as FindOptionsWhere<T>;

    return this.getRepository().findOne({ where });
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.getRepository().find(options);
  }

  public async findAllVersions(
    id: string | number,
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    const idCol = this.getIdColumn();
    const versionCol = this.getVersionColumn();

    const mergedWhere = Array.isArray(options?.where)
      ? options.where.map((condition) => ({
          ...condition,
          [idCol]: id,
        }))
      : {
          ...(options?.where || {}),
          [idCol]: id,
        };

    return this.getRepository().find({
      ...options,
      where: mergedWhere as FindOptionsWhere<T>,
      order: {
        ...(options?.order || {}),
        [versionCol]: 'DESC',
      } as FindOptionsOrder<T>,
    });
  }

  public async findAllLatest(options?: FindManyOptions<T>): Promise<T[]> {
    const isLatestKey = this.getIsLatestColumn();

    const mergedWhere = Array.isArray(options?.where)
      ? options.where.map((condition) => ({
          ...condition,
          [isLatestKey]: true,
        }))
      : {
          ...(options?.where || {}),
          [isLatestKey]: true,
        };

    return this.getRepository().find({
      ...options,
      where: mergedWhere as FindOptionsWhere<T>,
    });
  }

  async findWithRelations(options: FindManyOptions<T>): Promise<T[]> {
    const relationNames = this.getRelatedEntityNames();
    return this.getRepository().find({
      ...options,
      relations: relationNames,
    });
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return this.getRepository().save(data);
  }

  public async saveNewVersion(data: DeepPartial<T>): Promise<T> {
    const idCol = this.getIdColumn();
    const versionCol = this.getVersionColumn();
    const isLatestCol = this.getIsLatestColumn();

    if (!data[idCol]) {
      throw new Error('Missing ID for versioned save.');
    }

    const latest = await this.getRepository().findOne({
      where: { [idCol]: data[idCol] } as FindOptionsWhere<T>,
      order: { [this.getVersionColumn()]: 'DESC' } as FindOptionsOrder<T>,
    });

    const newVersion = ((latest?.[versionCol] as number) ?? 0) + 1;

    if (latest) {
      await this.getRepository().update(
        {
          [idCol]: data[idCol],
          [versionCol]: latest[versionCol],
        } as FindOptionsWhere<T>,
        {
          [isLatestCol]: false,
        } as T,
      );
    }

    const newEntity = {
      ...data,
      [versionCol]: newVersion,
      [isLatestCol]: true,
    };

    return this.getRepository().save(newEntity);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.getRepository().save(data);
  }

  public async upsert(data: Partial<T>): Promise<InsertResult> {
    return this.getRepository().upsert(data, [this.getIdColumn()]);
  }

  public async upsertMany(data: Partial<T>[]): Promise<InsertResult[]> {
    return Promise.all(data.map((item) => this.upsert(item)));
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
    return this.getRepository().preload(entityLike);
  }

  public async update(
    id: string | number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    const latest = await this.findOneById(id);
    if (!latest) throw new NotFoundException();

    await this.getRepository().update(
      {
        [this.getIdColumn()]: id,
        [this.getVersionColumn()]: latest[this.getVersionColumn()],
      } as FindOptionsWhere<T>,
      data,
    );

    return this.findOneById(id);
  }

  public async updateMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.getRepository().save(data);
  }

  public async remove(data: T): Promise<T> {
    return this.getRepository().remove(data);
  }

  public async delete(id: string | number): Promise<void> {
    const entity = await this.findOneById(id);
    if (!entity) throw new NotFoundException();
    await this.getRepository().delete({
      [this.getIdColumn()]: id,
      [this.getVersionColumn()]: entity[this.getVersionColumn()],
    } as FindOptionsWhere<T>);
  }

  public async deleteMany(ids: (string | number)[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  public async deleteAll(): Promise<void> {
    await this.getRepository().clear();
  }

  public async softDelete(id: string | number): Promise<T | null> {
    const entity = await this.findOneById(id);
    if (!entity) throw new NotFoundException();

    await this.getRepository().softDelete({
      [this.getIdColumn()]: id,
      [this.getVersionColumn()]: entity[this.getVersionColumn()],
    } as FindOptionsWhere<T>);

    return entity;
  }

  public async softDeleteMany(ids: (string | number)[]): Promise<T[]> {
    const entities = await this.findAll({
      where: {
        [this.getIdColumn()]: In(ids),
        [this.getIsLatestColumn()]: true,
      } as FindOptionsWhere<T>,
    });

    await Promise.all(
      entities.map((entity) =>
        this.getRepository().softDelete({
          [this.getIdColumn()]: entity[this.getIdColumn()],
          [this.getVersionColumn()]: entity[this.getVersionColumn()],
        } as FindOptionsWhere<T>),
      ),
    );

    return entities;
  }

  public async updateAssociations<
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
