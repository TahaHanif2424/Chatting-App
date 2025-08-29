import React, { useState, useEffect } from 'react';
import ChatListContainer from '../../components/a-level/Chats-display/ChatListContainer';
import ChatWindow from '../../components/a-level/Chats-display/Chat-Window';
import { useSocket } from '../../contexts/SocketContext';
// Update the path below if AddGroupModal is located elsewhere
import AddGroupModal from '../../components/b-level/Group/AddGroupModal';

export default function Dashboard() {
  const { registerUser, isConnected } = useSocket();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [activatedUser, setActivatedUser] = useState({ name: 'Select User', avatar: '', userId: '', isGroup:false });

  // NEW: control modal
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to get current user from localStorage:', error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.id && isConnected) registerUser(currentUser.id);
  }, [currentUser, isConnected, registerUser]);

  const handleCreateGroup = (groupName: string) => {
    console.log('Create group:', groupName);
    setIsAddGroupOpen(false);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="w-120 border-gray-200 overflow-y-auto">
        <ChatListContainer
          setActivatedUser={setActivatedUser}
          setAddGroup={setIsAddGroupOpen} 
        />
      </div>

      <div className="flex-1 flex flex-col">
        <ChatWindow activatedUser={activatedUser} />
      </div>

      {isAddGroupOpen && (
        <AddGroupModal
          onClose={() => setIsAddGroupOpen(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
}
