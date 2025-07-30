import { UserEntity } from '../entities/user.entity';

export const identifyUser = (user: UserEntity | null) => {
  if (!user) return 'unknown';
  return user?.firstName && user?.lastName
    ? `${user?.firstName?.charAt(0).toUpperCase() + user?.firstName.slice(1)} ${
        user?.lastName?.charAt(0).toUpperCase() + user?.lastName.slice(1)
      }`
    : user?.username || 'unknown';
};
