import { useTenant } from './tenantContext';
import { PermissionKey } from './permissions';

export function usePermission(permission: PermissionKey): boolean {
  const { heeftPermissie } = useTenant();
  return heeftPermissie(permission);
}
