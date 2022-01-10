export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum RoleType {
  admin = 'admin',
  vendor = 'vendor',
  customer = 'customer',
}

export const roleConfig = {
  [RoleType.admin]: [RolePermission.manageUsers],
  [RoleType.vendor]: [RolePermission.manageOrders],
  [RoleType.customer]: [RolePermission.placeOrder],
};
