import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';
import { TaskEntity } from './entities/task.entity';

@Module({
  controllers: [],
  providers: [TaskRepository, TaskService],
  exports: [TaskRepository, TaskService],
  imports: [TypeOrmModule.forFeature([TaskEntity])],
})
export class TasksModule {}
