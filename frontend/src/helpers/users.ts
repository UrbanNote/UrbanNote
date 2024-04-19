import type { UserProfileState, UserRolesState } from '$store/userStore';

export function getUsualFirstName(profile: UserProfileState | null) {
  if (!profile) return '';
  return profile.chosenName || profile.firstName;
}

export function getUsualName(profile: UserProfileState | null) {
  if (!profile) return '';
  return `${profile.chosenName || profile.firstName} ${profile.lastName}`;
}

export function getProfessionalName(profile: UserProfileState | null) {
  if (!profile) return '';
  return `${profile.firstName} ${profile.lastName}`;
}

export function getFullName(profile: UserProfileState | null) {
  if (!profile) return '';
  if (!profile.chosenName) return getProfessionalName(profile);
  return `${profile.chosenName} (${profile.firstName}) ${profile.lastName}`;
}

export function userIsAdmin(roles: UserRolesState | null) {
  if (!roles) return false;
  return roles.admin;
}

export function userHasExpenseManagement(roles: UserRolesState | null) {
  if (!roles) return false;
  return userIsAdmin(roles) || roles.expenseManagement;
}

export function userHasResourceManagement(roles: UserRolesState | null) {
  if (!roles) return false;
  return userIsAdmin(roles) || roles.resourceManagement;
}

export function userHasUserManagement(roles: UserRolesState | null) {
  if (!roles) return false;
  return userIsAdmin(roles) || roles.userManagement;
}
