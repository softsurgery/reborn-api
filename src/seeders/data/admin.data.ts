import { BasicRoles } from 'src/modules/user-management/enums/basic-roles.enum';
import { Gender } from 'src/modules/user-management/enums/gender.enum';

export const adminSeed = {
  core: {
    id: 'superadmin',
    firstName: 'SUPER$',
    lastName: 'SUPER$',
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: 'superpassword',
    roleId: BasicRoles.Admin,
    isActive: true,
    isApproved: true,
  },
  profile: {
    phone: '+33123456789',
    cin: '123456789',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    gender: Gender.Male,
    isPrivate: false,
  },
};
