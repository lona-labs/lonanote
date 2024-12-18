import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { useInited } from './hooks';
import Test from './pages/test';
import { AppTheme } from './utils/theme';

export const Title = () => {
  return (
    <div className="titlebar" style={{ height: 30, width: '100%', backgroundColor: 'white' }}></div>
  );
};

export const App = () => {
  const [inited, setInited] = useState(false);
  useInited(async () => {
    window.initializeSuccess = true;
    setInited(true);
  });
  return (
    <AppTheme>
      <Title />
      {/* {inited && <Router />} */}
      <Test />
      <ToastContainer />
    </AppTheme>
  );
};
