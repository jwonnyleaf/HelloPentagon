import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  email: string | null;
  username: string | null;
  login: (email: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem('email') || null
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || null
  );

  const login = (email: string, username: string) => {
    setIsAuthenticated(true);
    setEmail(email);
    setUsername(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail(null);
    setUsername(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, email, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
