import { LockModel } from './LockModel';
import { AccessModel } from './AccessModel';

export interface DatabaseSchema {
  relays: Array<LockModel>
  access: Array<AccessModel>
}

export const DatabaseCollections = {
  RELAYS: 'relays',
  ACCESS: 'access'
}
