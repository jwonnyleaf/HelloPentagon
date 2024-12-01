import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSnackbar } from './SnackbarProvider';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const showSnackbar = useSnackbar();
  const socket = io('http://localhost:5001', {
    transports: ['websocket'],
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('new_alert', (data: any) => {
    showSnackbar(`Action Required For ${data.file_name}`, 'info');
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
