import type { AnimationProps } from 'framer-motion';

export const slideIn: Pick<AnimationProps, 'initial' | 'animate' | 'exit' | 'transition'> = {
  initial: { x: '10%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-10%', opacity: 0 },
  transition: { duration: 0.3 },
};
