import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface Message {
  id: string;
  payload: string;
  fromId: string;
  toId: string;
  createdAt: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const useSocketMessage = (onMessageReceived: (message: Message) => void) => {
  const { socket, isConnected } = useSocket();

  const handleReceiveMessage = useCallback((message: Message) => {
    console.log('Received message:', message);
    onMessageReceived(message);
  }, [onMessageReceived]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, isConnected, handleReceiveMessage]);

  return { socket, isConnected };
};