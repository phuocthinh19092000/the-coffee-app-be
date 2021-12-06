export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum RoleType {
  admin = 'admin',
  vendor = 'vendor',
  employee = 'employee',
}

export const roleConfig = {
  [RoleType.admin]: [RolePermission.manageUsers],
  [RoleType.vendor]: [RolePermission.manageOrders],
  [RoleType.employee]: [RolePermission.placeOrder],
};
