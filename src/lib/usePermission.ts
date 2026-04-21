import { useTenant } from './tenantContext';
import { hasPermission, PermissionKey } from './permissions';

export function usePermission(permission: PermissionKey): boolean {
  const { role } = useTenant();
  return hasPermission(role, permission);
}
