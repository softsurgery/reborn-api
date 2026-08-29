import { Injectable } from '@nestjs/common';
import { DeepPartial, IsNull } from 'typeorm';
import { StorageFolderRepository } from '../repositories/storage-folder.repository';
import { StorageFolderEntity } from '../entities/storage-folder.entity';
import { StorageRepository } from '../repositories/storage.repository';
import { StorageEntity } from '../entities/storage.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { StorageNotFoundException } from '../errors/storage.not-found.error';
import { StorageBadRequestException } from '../errors/storage.bad-request.error';

@Injectable()
export class StorageFolderService extends AbstractCrudService<StorageFolderEntity> {
  constructor(
    private readonly storageFolderRepository: StorageFolderRepository,
    private readonly storageRepository: StorageRepository,
  ) {
    super(storageFolderRepository);
  }

  async findBySystematicName(
    systematicName: string,
  ): Promise<StorageFolderEntity | null> {
    return (
      (await this.storageFolderRepository.findOne({
        where: { systematicName },
      })) ?? null
    );
  }

  async findOrCreate(
    data: DeepPartial<StorageFolderEntity>,
  ): Promise<StorageFolderEntity> {
    if (data.systematicName) {
      const existing = await this.findBySystematicName(data.systematicName);
      if (existing) return existing;
    }

    return this.storageFolderRepository.save(data);
  }

  async assignFilesToFolder(
    uploadIds: number[],
    folderId: number,
  ): Promise<void> {
    if (!uploadIds.length) return;

    await Promise.all(
      uploadIds.map(async (uploadId) => {
        try {
          await this.assignFileToFolder(uploadId, folderId);
        } catch (error) {
          if (error instanceof StorageNotFoundException) {
            // Gracefully ignore missing uploads to prevent the entire transaction from failing
            // e.g. when updating a entity with previously deleted storage records
            return;
          }
          throw error;
        }
      }),
    );
  }

  async assignFileToFolder(
    uploadId: number,
    folderId: number,
  ): Promise<StorageEntity> {
    const upload = await this.storageRepository.findOneById(uploadId);
    if (!upload) throw new StorageNotFoundException();

    upload.folderId = folderId;
    upload.isTemporary = false;
    return this.storageRepository.save(upload);
  }

  async getTree(): Promise<StorageFolderEntity[]> {
    const folders = await this.storageFolderRepository.findAll({
      order: { name: 'ASC' },
    });

    return this.buildTree(folders);
  }

  async getFolderContents(
    folderId?: number,
  ): Promise<{ folders: StorageFolderEntity[]; files: StorageEntity[] }> {
    const folders = await this.storageFolderRepository.findAll({
      where: folderId ? { parentId: folderId } : { parentId: IsNull() },
      order: { name: 'ASC' },
    });

    const files = await this.storageRepository.findAll({
      where: folderId ? { folderId } : { folderId: IsNull() },
      order: { filename: 'ASC' },
    });

    return { folders, files };
  }

  async getFolderById(id: number): Promise<StorageFolderEntity> {
    const folder = await this.storageFolderRepository.findOneById(id);
    if (!folder) throw new StorageNotFoundException();
    return folder;
  }

  async getBreadcrumb(folderId: number): Promise<StorageFolderEntity[]> {
    const breadcrumb: StorageFolderEntity[] = [];
    let current = await this.getFolderById(folderId);

    while (current) {
      breadcrumb.unshift(current);
      if (!current.parentId) break;
      current = await this.getFolderById(current.parentId);
    }

    return breadcrumb;
  }

  async updateFolder(
    id: number,
    data: DeepPartial<StorageFolderEntity>,
  ): Promise<StorageFolderEntity> {
    const folder = await this.getFolderById(id);

    if (data.parentId !== undefined) {
      if (data.parentId === id) {
        throw new StorageBadRequestException(
          'A folder cannot be its own parent.',
        );
      }

      if (data.parentId) {
        const descendants = await this.getDescendantIds(id);
        if (descendants.includes(data.parentId)) {
          throw new StorageBadRequestException(
            'A folder cannot be moved into one of its descendants.',
          );
        }
      }
    }

    Object.assign(folder, data);
    return this.storageFolderRepository.save(folder);
  }

  async deleteFolder(id: number): Promise<StorageFolderEntity> {
    const folder = await this.getFolderById(id);

    if (folder.systematicName) {
      throw new StorageBadRequestException('System folders cannot be deleted.');
    }

    await this.storageFolderRepository.softDelete(id);
    return folder;
  }

  private async getDescendantIds(folderId: number): Promise<number[]> {
    const children = await this.storageFolderRepository.findAll({
      where: { parentId: folderId },
    });

    const ids = children.map((child) => child.id);
    for (const child of children) {
      ids.push(...(await this.getDescendantIds(child.id)));
    }

    return ids;
  }

  private buildTree(folders: StorageFolderEntity[]): StorageFolderEntity[] {
    const folderMap = new Map<number, StorageFolderEntity>();
    const roots: StorageFolderEntity[] = [];

    folders.forEach((folder) => {
      folder.children = [];
      folderMap.set(folder.id, folder);
    });

    folders.forEach((folder) => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId)!.children.push(folder);
      } else if (!folder.parentId) {
        roots.push(folder);
      }
    });

    return roots;
  }
}
