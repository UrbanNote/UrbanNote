import type { Unsubscribe } from 'firebase/auth';

export enum SubscriptionTypes {
  USER_PROFILE = 'user-profile',
  USER_ROLES = 'user-roles',
  EXPENSES = 'expenses',
}

const subscriptions = new Map<SubscriptionTypes, Unsubscribe>();

export function pushSubscriber(id: SubscriptionTypes, unsubscribe: Unsubscribe) {
  if (subscriptions.has(id)) {
    subscriptions.get(id)?.();
  }

  subscriptions.set(id, unsubscribe);
}

export function unsubscribeFrom(id: SubscriptionTypes) {
  const unsubscribe = subscriptions.get(id);
  if (unsubscribe) {
    unsubscribe();
    subscriptions.delete(id);
  }
}

export function unsubscribeAll() {
  subscriptions.forEach(unsubscribe => {
    unsubscribe();
  });
  subscriptions.clear();
}
