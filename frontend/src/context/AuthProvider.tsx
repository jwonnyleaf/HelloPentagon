import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  userID: string | null;
  email: string | null;
  username: string | null;
  level: string | null;
  login: (
    userID: string,
    email: string,
    username: string,
    level: string
  ) => void;
  logout: () => void;
  setLevel: (level: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userID, setUserID] = useState(
    () => localStorage.getItem('userID') || null
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem('email') || null
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || null
  );
  const [level, setLevel] = useState(
    () => localStorage.getItem('level') || null
  );

  const login = (
    userID: string,
    email: string,
    username: string,
    level: string
  ) => {
    setIsAuthenticated(true);
    setUserID(userID);
    setEmail(email);
    setUsername(username);
    setLevel(level);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userID', userID);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('level', level);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserID(null);
    setEmail(null);
    setUsername(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userID');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('level');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userID,
        email,
        username,
        level,
        login,
        logout,
        setLevel,
      }}
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
