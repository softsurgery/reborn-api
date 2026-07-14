import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../repositories/task.repository';
import { TaskEntity } from '../entities/task.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class TaskService extends AbstractCrudService<TaskEntity> {
  constructor(private readonly taskRepository: TaskRepository) {
    super(taskRepository);
  }
}
