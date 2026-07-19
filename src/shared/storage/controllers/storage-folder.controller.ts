import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StorageFolderService } from '../services/storage-folder.service';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import {
  ResponseStorageFolderContentsDto,
  ResponseStorageFolderDto,
} from '../dtos/response-storage-folder.dto';
import { ResponseStorageDto } from '../dtos/response-storage.dto';
import { CreateStorageFolderDto } from '../dtos/create-storage-folder.dto';
import { UpdateStorageFolderDto } from '../dtos/update-storage-folder.dto';

@ApiTags('storage-folder')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: '1',
  path: '/storage-folder',
})
export class StorageFolderController {
  constructor(private readonly storageFolderService: StorageFolderService) {}

  @Get('/tree')
  async getTree(): Promise<ResponseStorageFolderDto[]> {
    return toDtoArray(
      ResponseStorageFolderDto,
      await this.storageFolderService.getTree(),
    );
  }

  @Get('/contents')
  async getRootContents(): Promise<ResponseStorageFolderContentsDto> {
    const contents = await this.storageFolderService.getFolderContents();
    return {
      folders: toDtoArray(ResponseStorageFolderDto, contents.folders),
      files: toDtoArray(ResponseStorageDto, contents.files),
    };
  }

  @Get('/:id/breadcrumb')
  async getBreadcrumb(
    @Param('id') id: number,
  ): Promise<ResponseStorageFolderDto[]> {
    return toDtoArray(
      ResponseStorageFolderDto,
      await this.storageFolderService.getBreadcrumb(id),
    );
  }

  @Get('/:id/contents')
  async getFolderContents(
    @Param('id') id: number,
  ): Promise<ResponseStorageFolderContentsDto> {
    await this.storageFolderService.getFolderById(id);
    const contents = await this.storageFolderService.getFolderContents(id);
    return {
      folders: toDtoArray(ResponseStorageFolderDto, contents.folders),
      files: toDtoArray(ResponseStorageDto, contents.files),
    };
  }

  @Get('/:id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseStorageFolderDto> {
    return toDto(
      ResponseStorageFolderDto,
      await this.storageFolderService.getFolderById(id),
    );
  }

  @Post()
  async create(
    @Body() createStorageFolderDto: CreateStorageFolderDto,
  ): Promise<ResponseStorageFolderDto> {
    return toDto(
      ResponseStorageFolderDto,
      await this.storageFolderService.save(createStorageFolderDto),
    );
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateStorageFolderDto: UpdateStorageFolderDto,
  ): Promise<ResponseStorageFolderDto> {
    return toDto(
      ResponseStorageFolderDto,
      await this.storageFolderService.updateFolder(id, updateStorageFolderDto),
    );
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<ResponseStorageFolderDto> {
    return toDto(
      ResponseStorageFolderDto,
      await this.storageFolderService.deleteFolder(id),
    );
  }
}
