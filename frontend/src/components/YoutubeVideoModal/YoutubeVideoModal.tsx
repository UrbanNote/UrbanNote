import { useEffect } from 'react';

import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import { X } from 'react-bootstrap-icons';
import { createPortal } from 'react-dom';

import { fade } from '$animations';

export type YoutubeVideoModalProps = {
  src: string;
  show: boolean;
  title: string;
  onHide: () => void;
};

function YoutubeVideoModal({ src, show, title, onHide }: YoutubeVideoModalProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onHide();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, onHide]);

  if (!show) {
    return null;
  }

  return createPortal(
    <motion.div
      {...fade}
      key="video"
      className="position-absolute top-0 start-0 bottom-0 end-0 d-flex p-5 bg-dark"
      style={{ zIndex: 2000 }}>
      <Button variant="quiet" onClick={onHide} className="position-absolute p-0 close-button">
        <X size={48} className="d-block h-auto text-white" />
      </Button>
      <div className="p-4 w-100">
        <iframe src={src} title={title} className="w-100 h-100" />
      </div>
    </motion.div>,
    document.body,
  );
}

export default YoutubeVideoModal;
