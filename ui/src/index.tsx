import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/initialize';

import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
