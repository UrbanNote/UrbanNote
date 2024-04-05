export enum EntityTypes {
  EXPENSE = 'expenseDetails',
}

export type FileMetadata = {
  userId?: string;
  entityType?: EntityTypes;
  entityId?: string;
};
