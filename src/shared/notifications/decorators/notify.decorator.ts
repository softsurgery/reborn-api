import { SetMetadata } from '@nestjs/common';
import { NotificationType } from '../../../app/enums/notification-type.enum';

export const Notify = (type: NotificationType) => SetMetadata('type', type);
