import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TriggerRegistry } from './trigger-registry.service';

@Injectable()
export class TriggerSynchronizer implements OnApplicationBootstrap {
  constructor(
    private dataSource: DataSource,
    private registry: TriggerRegistry,
  ) {}

  async onApplicationBootstrap() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    try {
      for (const trigger of this.registry.getAll()) {
        for (const sql of trigger.dropSql()) {
          await queryRunner.query(sql);
        }

        const fnSql = trigger.createFunctionSql();
        if (fnSql) {
          await queryRunner.query(fnSql);
        }

        for (const apply of trigger.apply) {
          const triggerName = trigger.triggerName(apply);
          await queryRunner.query(trigger.createTriggerSql(apply, triggerName));
        }
      }
    } finally {
      await queryRunner.release();
    }
  }
}
