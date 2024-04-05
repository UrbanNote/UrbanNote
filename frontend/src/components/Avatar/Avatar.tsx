import { forwardRef } from 'react';

import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import { PersonFill } from 'react-bootstrap-icons';

import type { AvatarProps } from './types';

import './Avatar.scss';

const Avatar = forwardRef<HTMLButtonElement, AvatarProps>(({ profile, buttonSize, onClick }, ref) => {
  const isEmpty = !profile?.pictureId;
  const realSize = buttonSize || 32;

  return (
    <Button
      ref={ref}
      variant="transparent"
      onClick={onClick}
      className={classNames('Avatar p-0 rounded-circle bg-primary-100 text-dark', {
        empty: isEmpty,
        'border-0': isEmpty,
      })}
      style={{
        width: realSize,
        height: realSize,
      }}>
      {!isEmpty ? <img src={profile.pictureId} alt="" /> : <PersonFill />}
    </Button>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
