import React, { useState, useEffect } from 'react';
import ChatListContainer from '../../components/a-level/Chats-display/ChatListContainer';
import ChatWindow from '../../components/a-level/Chats-display/Chat-Window';
import { useSocket } from '../../contexts/SocketContext';
// Update the path below if AddGroupModal is located elsewhere
import AddGroupModal from '../../components/b-level/Group/AddGroupModal';
import AddMember from '../../components/b-level/Group/Add-member';
import GroupMembersModal from '../../components/b-level/Group/GroupMembersModal';
import { useQuery } from '@tanstack/react-query';
import { getGroupMembers } from '../../components/b-level/function';

export default function Dashboard() {
  const { registerUser, isConnected } = useSocket();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [activatedUser, setActivatedUser] = useState({ name: 'Select User', avatar: '', userId: '', isGroup: false });

  // NEW: control modal
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [addedMembers, setAddedMembers] = useState(false);
  const [showGroupMembers, setShowGroupMembers] = useState(false);

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
    setIsAddGroupOpen(false);
  };
console.log('activatedUser:', activatedUser);
  console.log('showGroupMembers:', showGroupMembers);
  
  const { data: members, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ["members", activatedUser.userId],
    queryFn: () => getGroupMembers(activatedUser.userId),
    enabled: !!activatedUser.isGroup && !!activatedUser.userId
  })
  
  console.log('members:', members, 'loading:', membersLoading, 'error:', membersError);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147, 51, 234) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Sidebar - Fixed width with proper spacing */}
      <div className="w-[400px] min-w-[400px] bg-white border-r border-gray-200 shadow-lg flex flex-col relative z-10 h-full">
        <ChatListContainer
          setActivatedUser={setActivatedUser}
          setAddGroup={setIsAddGroupOpen}
          setAddMembers={setAddedMembers}
        />
      </div>

      {/* Main Chat Area - Flexible width */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 h-full">
        {!addedMembers ? !showGroupMembers ? (<ChatWindow activatedUser={activatedUser} setAddMembers={setAddedMembers} setShowGroupMembers={setShowGroupMembers}/>) : (<GroupMembersModal onClose={() => setShowGroupMembers(false)} members={members || []}/>) : (<AddMember setAddMembers={setAddedMembers} activatedUser={activatedUser}/>)}
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
