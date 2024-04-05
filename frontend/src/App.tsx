import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { Alerts, Splash } from '$components';
import { useAppDataSubscription } from '$hooks';
import AppRouter from '$router';

function App() {
  const [authReady, setAuthReady] = useState(false);

  useAppDataSubscription(
    () => setAuthReady(false),
    // slight delay so the user's data has time to be pushed to redux
    () => setTimeout(() => setAuthReady(true), 1000),
  );

  return (
    <>
      <AnimatePresence>{!authReady && <Splash />}</AnimatePresence>
      {authReady && <AppRouter />}
      <Alerts />
    </>
  );
}

export default App;
