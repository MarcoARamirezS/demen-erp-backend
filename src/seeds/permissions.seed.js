import { CORE_PERMS, RESOURCES, ACTIONS } from '../constants/acl.js';

export const PERMISSIONS_SEED = [
  {
    code: CORE_PERMS.USERS_CREATE,
    resource: RESOURCES.USERS,
    action: ACTIONS.CREATE,
    name: 'Crear usuarios',
    isSystem: true,
    active: true,
  },
  {
    code: CORE_PERMS.USERS_READ,
    resource: RESOURCES.USERS,
    action: ACTIONS.READ,
    name: 'Ver usuario',
    isSystem: true,
    active: true,
  },
  {
    code: CORE_PERMS.USERS_UPDATE,
    resource: RESOURCES.USERS,
    action: ACTIONS.UPDATE,
    name: 'Actualizar usuario',
    isSystem: true,
    active: true,
  },
  {
    code: CORE_PERMS.USERS_DELETE,
    resource: RESOURCES.USERS,
    action: ACTIONS.DELETE,
    name: 'Eliminar usuario',
    isSystem: true,
    active: true,
  },
  {
    code: CORE_PERMS.USERS_LIST,
    resource: RESOURCES.USERS,
    action: ACTIONS.LIST,
    name: 'Listar usuarios',
    isSystem: true,
    active: true,
  },
];
