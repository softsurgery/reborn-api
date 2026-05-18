export interface TriggerApply {
  table: string;
  type: 'BEFORE' | 'AFTER';
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
}

export interface DatabaseTrigger {
  name: string;
  apply: TriggerApply[];
  createFunctionSql(): string;
  createTriggerSql(apply: TriggerApply, triggerName: string): string;
  triggerName(apply: TriggerApply): string;
  dropSql(): string[];
}

export abstract class AbstractTrigger implements DatabaseTrigger {
  abstract name: string;
  abstract apply: TriggerApply[];

  abstract createFunctionSql(): string;
  abstract createTriggerSql(apply: TriggerApply, triggerName: string): string;

  triggerName(apply: TriggerApply): string {
    return `${this.name}_${apply.operation.toLowerCase()}_${apply.table}`.slice(
      0,
      64,
    );
  }

  dropSql(): string[] {
    return this.apply.map(
      (a) => `DROP TRIGGER IF EXISTS \`${this.triggerName(a)}\`;`,
    );
  }
}
