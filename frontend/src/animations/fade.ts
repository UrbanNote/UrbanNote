import type { AnimationProps } from 'framer-motion';

export const fade: Pick<AnimationProps, 'initial' | 'animate' | 'exit' | 'transition'> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const fadeIn: Pick<AnimationProps, 'initial' | 'animate' | 'exit' | 'transition'> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
  transition: { duration: 0.3 },
};

export const fadeOut: Pick<AnimationProps, 'initial' | 'animate' | 'exit' | 'transition'> = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};
