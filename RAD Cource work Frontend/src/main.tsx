import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux'; // ✅ Import Provider
import { store } from './redux/store';  // ✅ Import Store

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Provider එක ඇතුලේ App එක දාන්න */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);