import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends DatabaseAbstractRepository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(taskRepository, txHost);
  }
}
