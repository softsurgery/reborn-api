import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ProfileEntity } from '../entities/profile.entity';

@Injectable()
export class ProfileRepository extends DatabaseAbstractRepository<ProfileEntity> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(profileRepository, txHost);
  }
}
