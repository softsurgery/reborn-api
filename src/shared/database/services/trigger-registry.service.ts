import { Injectable } from '@nestjs/common';
import { DatabaseTrigger } from '../interfaces/database-trigger.interface';

@Injectable()
export class TriggerRegistry {
  private triggers: DatabaseTrigger[] = [];

  register(trigger: DatabaseTrigger) {
    this.triggers.push(trigger);
  }

  getAll() {
    return this.triggers;
  }
}
