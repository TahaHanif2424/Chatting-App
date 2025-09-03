import {
  ArrowLeft,
  PhoneCall,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Camera,
  Mic,
  Send,
  Loader,
  UserPlus,
  Users,
  LogOut 
} from 'lucide-react';
import Input from '../../c-level/Input';
import Button from '../../c-level/Button';
import { useChat } from './useChat';
import { DEFAULT_AVATAR_URL } from '../../../constants/constants';
import { useState, useRef, useEffect } from 'react';
import type { ChatWindowProps } from '../../b-level/types-b';
import { useSocket } from '../../../contexts/SocketContext';
import DropdownList from '../../c-level/DropdownList';

export default function ChatWindow({ activatedUser, setAddMembers, setShowGroupMembers }:ChatWindowProps ) {
  const { joinGroup } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    userLoading,
    userError,
    groupMessages,
    groupLoading,
    groupError,
    currentUser,
    values,
    handleChange,
    handleSubmit,
    leaveGroupMutation
  } = useChat(activatedUser.userId, activatedUser.isGroup);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, groupMessages]);

  // Join group room when viewing a group chat
  useEffect(() => {
    if (activatedUser.isGroup && activatedUser.userId) {
      joinGroup(activatedUser.userId);
    }
  }, [activatedUser.userId, activatedUser.isGroup, joinGroup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddMember = () => {
    setShowDropdown(false);
    if (setAddMembers) setAddMembers(true);
  };

  const handleShowGroupMembers = () => {
    console.log('Group Members clicked');
    setShowDropdown(false);
    if (setShowGroupMembers) {
      console.log('Setting showGroupMembers to true');
      setShowGroupMembers(true);
    } else {
      console.log('setShowGroupMembers is undefined');
    }
  };

  const handleLeavegroup=async()=>{
    leaveGroupMutation.mutate(activatedUser.userId)
  }
  const dropdownOptions = [
    {
      text: 'Add Member',
      Icon: UserPlus,
      action: handleAddMember,
    },
    {
      text: 'Group Members',
      Icon: Users,
      action: handleShowGroupMembers,
    },
    {
      text: 'Leave Group ',
      Icon: LogOut,
      action:handleLeavegroup
    },
  ];

  if (userLoading || groupLoading) {
    return <Loader />;
  }

  if (userError || groupError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center text-red-500">
          <p>Error loading messages</p>
          <p className="text-sm text-gray-600">{userError?.message || groupError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">

      {activatedUser.userId ? (<><div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <img
              src={activatedUser.avatar}
              alt={`${activatedUser.name} avatar`}
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-200" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="text-gray-900 font-medium text-sm">{activatedUser.name}</p>
            <p className="text-xs text-gray-500">{activatedUser.isGroup ? 'Group Chat' : 'Active now'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors group">
            <PhoneCall className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
          </button>
          <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors group">
            <Video className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
          </button>
          {activatedUser.isGroup && (
            <div className="relative" ref={dropdownRef}>
              <button 
                className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreVertical className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
              </button>
              {showDropdown && (
                <DropdownList options={dropdownOptions} />
              )}
            </div>
          )}
          {!activatedUser.isGroup && (
            <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors group">
              <MoreVertical className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {(activatedUser.isGroup ? groupMessages : messages).length > 0 ? (
              (activatedUser.isGroup ? groupMessages : messages).map((msg) => {
                const isFromMe = currentUser?.id === msg.fromId;
                return (
                  <div key={msg.id} className={`mb-3 flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                    {!isFromMe && (
                      <img
                        src={msg.from?.avatar || DEFAULT_AVATAR_URL}
                        alt={msg.from.name}
                        className="w-7 h-7 rounded-full mr-2 object-cover border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <div className="max-w-[70%]">
                      {!isFromMe && activatedUser.isGroup && (
                        <p className="text-xs text-gray-500 mb-1 ml-2">{msg.from.name}</p>
                      )}
                      <div className={`px-3 py-2 rounded-2xl ${isFromMe
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'} shadow-sm`}>
                        <p className="text-sm">{msg.payload}</p>
                        {msg.createdAt && (
                          <span
                            className={`text-[10px] mt-0.5 block ${isFromMe ? 'text-purple-100' : 'text-gray-400'}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    {isFromMe && (
                      <img
                        src={msg.from?.avatar || DEFAULT_AVATAR_URL}
                        alt="You"
                        className="w-7 h-7 rounded-full ml-2 object-cover border border-purple-200 flex-shrink-0"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-base font-medium">No messages yet</p>
                <p className="text-sm mt-1">Start the conversation!</p>
              </div>
            )}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>


        <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Smile className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Camera className="w-4 h-4 text-gray-500" />
            </button>

            <Input
              name="payload"
              type="text"
              value={values.payload}
              onChange={handleChange}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
            />

            {values.payload.trim() ? (
              <Button type="submit" className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-md transition-all">
                <Send className="w-4 h-4 text-white" />
              </Button>
            ) : (
              <button type="button" className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <Mic className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </form>
      </>) : (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ChatApp Pro</h2>
            <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting with your friends and groups</p>
          </div>
        </div>

      )}

    </div>
  );
}
