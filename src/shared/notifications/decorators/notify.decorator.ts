import { NotificationType } from '../../../app/enums/notification-type.enum';

export const NOTIFY_METADATA_KEY = 'notification:types';
export const BATCH_NOTIFY_METADATA_KEY = 'notification:batch';

export interface BatchNotificationEntry {
  userId: string;
  payload: Record<string, unknown>;
}

export interface BatchNotificationInfo {
  type: NotificationType;
  entries: BatchNotificationEntry[];
}

export const Notify = (type: NotificationType): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const existingTypes: NotificationType[] =
      Reflect.getMetadata(NOTIFY_METADATA_KEY, descriptor.value as object) ||
      [];
    Reflect.defineMetadata(
      NOTIFY_METADATA_KEY,
      [...existingTypes, type],
      descriptor.value as object,
    );
    return descriptor;
  };
};

export const BatchNotify = (type: NotificationType): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const existingTypes: NotificationType[] =
      Reflect.getMetadata(
        BATCH_NOTIFY_METADATA_KEY,
        descriptor.value as object,
      ) || [];
    Reflect.defineMetadata(
      BATCH_NOTIFY_METADATA_KEY,
      [...existingTypes, type],
      descriptor.value as object,
    );
    return descriptor;
  };
};
