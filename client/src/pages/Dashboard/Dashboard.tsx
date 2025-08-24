import React, { useState, useEffect } from 'react';
import ChatListContainer from '../../components/a-level/Chats-display/ChatListContainer';
import ChatWindow from '../../components/a-level/Chats-display/Chat-Window';
import { useSocket } from '../../contexts/SocketContext';
import axiosInstance from '../../lib/axiosInstance';

export default function Dashboard() {
  const { registerUser, isConnected } = useSocket();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [activatedUser, setActivatedUser] = useState({
    name: 'Select User', avatar: '', userId:''
  });

  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Failed to get current user from localStorage:', error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.id && isConnected) {
      registerUser(currentUser.id);
    }
  }, [currentUser, isConnected, registerUser]);



  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left pane: chat list */}
      <div className="w-120 border-gray-200 overflow-y-auto">
        <ChatListContainer setActivatedUser={setActivatedUser}/>
      </div>

      {/* Right pane: active chat */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          activatedUser={activatedUser}
        />
      </div>
    </div>
  );
}
