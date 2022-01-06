import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../modules/roles/constants/role.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
