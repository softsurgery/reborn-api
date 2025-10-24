import { SetMetadata } from '@nestjs/common';
import { NotificationType } from '../enums/notification-type.enum';

export const Notify = (type: NotificationType) => SetMetadata('type', type);
