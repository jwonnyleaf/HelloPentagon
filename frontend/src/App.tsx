import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import SignIn from './components/Account/SignIn';
import SignUp from './components/Account/SignUp';

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
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Protected Route for Dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Dashboard logout={logout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Login Route */}
          <Route path="/login" element={<SignIn login={login} />} />
          {/* Sign Up Route */}
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
