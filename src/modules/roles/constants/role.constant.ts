export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum RoleType {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
}

export const roleConfig = {
  [RoleType.ADMIN]: [RolePermission.manageUsers],
  [RoleType.VENDOR]: [RolePermission.manageOrders],
  [RoleType.CUSTOMER]: [RolePermission.placeOrder],
};
