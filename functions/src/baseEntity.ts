import type { Timestamp } from 'firebase-admin/firestore';

/**
 * Base type for all entities in the system. The id should correspond to the document id in Firestore.
 */
export type BaseEntity = {
  /** The id of the entity. It should correspond to the document's id. */
  id: string;
  /** Creation date of the entity. This value should never be modified. */
  createdAt: Timestamp;
  /** Last update timestamp of the entity. This value should only be modified by repositories. */
  updatedAt: Timestamp;
  /** The id of the entity's creator. This value shoud never be modified. */
  createdBy: string;
  /** The id of the last entity who has modified this entity. This value should only be modified by repositories. */
  updatedBy: string;
};
