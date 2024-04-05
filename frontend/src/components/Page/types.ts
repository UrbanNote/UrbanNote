import type { HTMLAttributes, PropsWithChildren } from 'react';

export type PageProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    background?: 'white';
  }>;
