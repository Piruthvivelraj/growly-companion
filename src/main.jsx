import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { HabitProvider } from './context/HabitContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          <HabitProvider>
            <App />
          </HabitProvider>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);