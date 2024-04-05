import type { Icon } from 'react-bootstrap-icons';

export type AppNavLinkProps = {
  to: string;
  icon: Icon;
  text: string;
  exact?: boolean;
};
