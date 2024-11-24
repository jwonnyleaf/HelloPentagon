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
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Protected Route for Dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          {/* Login Route */}
          <Route path="/login" element={<SignIn />} />
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
