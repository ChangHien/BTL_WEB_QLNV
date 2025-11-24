import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'antd/dist/reset.css';

import { AuthProvider } from './contexts/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BỌC AuthProvider RA NGOÀI App */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>,
);