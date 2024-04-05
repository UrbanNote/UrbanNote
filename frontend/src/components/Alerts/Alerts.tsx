import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Alert from 'react-bootstrap/Alert';
import { createPortal } from 'react-dom';

import { fadeOut } from '$animations';
import { useScreenMinWidth } from '$hooks';
import { useAppDispatch, useAppSelector } from '$store';
import { removeAlert } from '$store/alertStore';

function Alerts() {
  const alerts = useAppSelector(state => state.alerts.alerts);
  const alertElement = useRef(document.createElement('div'));
  const isAboveSmBreakpoint = useScreenMinWidth('sm');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const el = alertElement.current;
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (!alerts.length) return null;

  return createPortal(
    <div
      className="Alerts fixed-bottom mx-auto d-flex flex-column gap-3 p-3"
      style={{
        maxWidth: isAboveSmBreakpoint ? '500px' : 'calc(100% - 2rem)',
        zIndex: 10000,
      }}>
      <AnimatePresence>
        {alerts.map(({ id, type, message }) => (
          <motion.div key={id} {...fadeOut}>
            <Alert className="mb-0" variant={type} onClose={() => dispatch(removeAlert(id))} dismissible>
              {message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    alertElement.current,
  );
}

export default Alerts;
