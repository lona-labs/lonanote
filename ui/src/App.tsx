import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { useInited } from './hooks';
import { AppTheme } from './utils/theme';
import Test from './pages/test';

export const App = () => {
  const [inited, setInited] = useState(false);
  useInited(async () => {
    window.initializeSuccess = true;
    setInited(true);
  });
  return (
    <AppTheme>
      {/* {inited && <Router />} */}
      <Test />
      <ToastContainer />
    </AppTheme>
  );
};
