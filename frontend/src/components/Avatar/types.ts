import type { MouseEventHandler } from 'react';

import type { UserProfileState } from '$store/userStore';

export type AvatarProps = {
  profile: Pick<UserProfileState, 'pictureId' | 'firstName' | 'lastName'> | null;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  buttonSize?: number;
};
