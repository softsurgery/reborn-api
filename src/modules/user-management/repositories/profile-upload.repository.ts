import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ProfileUploadEntity } from '../entities/profile-upload.entity';

@Injectable()
export class ProfileUploadRepository extends DatabaseAbstractRepository<ProfileUploadEntity> {
  constructor(
    @InjectRepository(ProfileUploadEntity)
    private readonly profileUploadRepository: Repository<ProfileUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(profileUploadRepository, txHost);
  }
}
