import { NavLink } from 'react-router-dom';

import type { AppNavLinkProps } from './types';

function AppNavLink({ icon: Icon, text, ...restProps }: AppNavLinkProps) {
  return (
    <NavLink className="AppNav__Link d-flex flex-column align-items-center w-100" {...restProps}>
      <Icon size={24} />
      <span>{text}</span>
    </NavLink>
  );
}

export default AppNavLink;
