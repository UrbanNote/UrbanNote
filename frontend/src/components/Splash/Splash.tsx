import { motion } from 'framer-motion';

import { fadeOut } from '$animations';

import './Splash.scss';

export function Splash() {
  return (
    <motion.div className="Splash bg-light text-center" {...fadeOut} transition={{ duration: 0.6 }}>
      <img src="/icon.svg" />
    </motion.div>
  );
}
