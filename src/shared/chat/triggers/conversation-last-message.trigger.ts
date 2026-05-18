import {
  AbstractTrigger,
  TriggerApply,
} from 'src/shared/database/interfaces/database-trigger.interface';

export class ConversationLastMessageTrigger extends AbstractTrigger {
  name = 'conv_last_message_sync';

  apply: TriggerApply[] = [
    {
      table: 'messages',
      type: 'AFTER',
      operation: 'INSERT',
    },
  ];

  createFunctionSql(): string {
    return '';
  }

  createTriggerSql(apply: TriggerApply, triggerName: string): string {
    return `
      CREATE TRIGGER \`${triggerName}\`
      ${apply.type} ${apply.operation} ON \`${apply.table}\`
      FOR EACH ROW
      BEGIN
        UPDATE conversations
        SET lastMessageId = NEW.id
        WHERE id = NEW.conversationId;
      END;
    `;
  }
}
