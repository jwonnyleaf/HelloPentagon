import React, { useState } from 'react';
import { createTheme, Snackbar, ThemeProvider } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from './context/SnackbarProvider';
import Dashboard from './components/Dashboard/Dashboard';
import SignIn from './components/Account/SignIn';
import SignUp from './components/Account/SignUp';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';

const theme = createTheme({
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
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
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
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
