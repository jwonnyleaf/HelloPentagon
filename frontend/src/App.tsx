import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from './context/SnackbarProvider';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Account/Login';
import Register from './components/Account/Register';
import Results from './components/FileUpload/Results';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import { SocketProvider } from './context/SocketProvider';

const theme = createTheme({
  components: {
    MuiBadge: {
      styleOverrides: {
        badge: {
          top: '-5px',
          right: '-5px',
          backgroundColor: '#f44336',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: '600',
          minWidth: '20px',
          height: '20px',
          borderRadius: '50%',
          boxShadow: '0 0 5px rgba(244, 67, 54, 0.7)',
        },
      },
    },
  },
  typography: {
    fontSize: 14,
    h6: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body2: {
      fontSize: '1rem',
    },
  },
  palette: {
    primary: {
      main: '#087E8B',
      dark: '#056C78',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <SocketProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/file/:fileID"
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/" replace />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </ThemeProvider>
        </SocketProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
