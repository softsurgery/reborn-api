import {
  AbstractTrigger,
  TriggerApply,
} from 'src/shared/database/interfaces/database-trigger.interface';

export class ConversationParticipantsTrigger extends AbstractTrigger {
  name = 'conv_participants_sync';

  apply: TriggerApply[] = [
    {
      table: 'conversation_users',
      type: 'AFTER',
      operation: 'INSERT',
    },
    {
      table: 'conversation_users',
      type: 'AFTER',
      operation: 'DELETE',
    },
    {
      table: 'users',
      type: 'AFTER',
      operation: 'UPDATE',
    },
  ];

  createFunctionSql(): string {
    return '';
  }

  private participantsSelectSql(conversationIdExpr: string): string {
    return `
          SELECT GROUP_CONCAT(
            CASE
              WHEN u.firstName IS NOT NULL AND u.lastName IS NOT NULL
              THEN CONCAT(CONCAT(UPPER(LEFT(u.firstName, 1)), SUBSTRING(u.firstName, 2)), ' ', CONCAT(UPPER(LEFT(u.lastName, 1)), SUBSTRING(u.lastName, 2)))
              WHEN u.username IS NOT NULL THEN u.username
              ELSE 'unknown'
            END
            SEPARATOR ','
          )
          FROM conversation_users cp
          INNER JOIN users u
            ON u.id = cp.userId
          WHERE cp.conversationId = ${conversationIdExpr}`;
  }

  createTriggerSql(apply: TriggerApply, triggerName: string): string {
    if (apply.table === 'conversation_users') {
      const row = apply.operation === 'DELETE' ? 'OLD' : 'NEW';
      return `
        CREATE TRIGGER \`${triggerName}\`
        ${apply.type} ${apply.operation} ON \`${apply.table}\`
        FOR EACH ROW
        BEGIN
          UPDATE conversations c
          SET c.participantsIdentifiers = (${this.participantsSelectSql(`${row}.conversationId`)})
          WHERE c.id = ${row}.conversationId;
        END;
      `;
    }

    // users table: update all conversations this user participates in
    return `
      CREATE TRIGGER \`${triggerName}\`
      ${apply.type} ${apply.operation} ON \`${apply.table}\`
      FOR EACH ROW
      BEGIN
        UPDATE conversations c
        SET c.participantsIdentifiers = (${this.participantsSelectSql('c.id')})
        WHERE c.id IN (
          SELECT cp.conversationId
          FROM conversation_users cp
          WHERE cp.userId = NEW.id
        );
      END;
    `;
  }
}
