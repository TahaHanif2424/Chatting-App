import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  registerUser: (userId: string) => void;
  joinGroup: (groupId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      socketInstance.close();
    };
  }, []);

  const registerUser = (userId: string) => {
    if (socket && isConnected) {
      socket.emit('register', userId);
      console.log(`Registered user: ${userId}`);
    }
  };

  const joinGroup = (groupId: string) => {
    if (socket && isConnected) {
      socket.emit('join_group', groupId);
      console.log(`Joined group: ${groupId}`);
    }
  };

  const value = {
    socket,
    isConnected,
    registerUser,
    joinGroup,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};