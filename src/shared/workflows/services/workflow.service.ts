import { BadRequestException, Injectable } from '@nestjs/common';
import { getNextSnapshot } from 'xstate';

interface WorkflowMachine {
  resolveState(config: { value: unknown }): WorkflowSnapshot;
}

interface WorkflowSnapshot {
  can(event: { type: string }): boolean;
  getMeta(): Record<string, unknown>;
}

@Injectable()
export class AbstractWorkflowService<
  S extends string | number,
  E extends string | number,
> {
  machine: WorkflowMachine;
  constructor(
    machine: WorkflowMachine,
    private readonly eventsEnum: Record<string, E>,
  ) {
    this.machine = machine;
  }

  canTransition(currentStatus: S, event: E): boolean {
    const snapshot = this.machine.resolveState({
      value: currentStatus,
    });
    return snapshot.can({ type: String(event) });
  }

  transition(currentStatus: S, event: E): S {
    const snapshot = this.machine.resolveState({
      value: currentStatus,
    });

    if (!snapshot.can({ type: String(event) })) {
      throw new BadRequestException(
        `Cannot perform '${String(event)}' with status '${String(currentStatus)}'`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextSnapshot = getNextSnapshot(this.machine as any, snapshot as any, {
      type: String(event),
    });
    return (nextSnapshot as { value: S }).value;
  }

  getNextSteps(currentStatus: S): { label: string }[] {
    const snapshot = this.machine.resolveState({
      value: currentStatus,
    });

    const allEvents = Object.values(this.eventsEnum);

    return allEvents
      .filter((event) => snapshot.can({ type: String(event) }))
      .map((event) => ({ label: String(event) }));
  }

  isUpdatable(currentStatus: S): boolean {
    const snapshot = this.machine.resolveState({
      value: currentStatus,
    });

    const meta = snapshot.getMeta();

    // pick the first (and only) meta entry
    const stateMeta = Object.values(meta)[0] as
      | { isUpdatable?: boolean }
      | undefined;

    return stateMeta?.isUpdatable ?? false;
  }
}
