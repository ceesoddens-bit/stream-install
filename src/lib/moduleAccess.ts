import { INBEGREPEN_MODULES, ModuleKey } from './modules';

export function heeftToegang(key: ModuleKey, actief: ModuleKey[] | undefined): boolean {
  if (INBEGREPEN_MODULES.includes(key)) return true;
  if (!actief) return false;
  return actief.includes(key);
}
