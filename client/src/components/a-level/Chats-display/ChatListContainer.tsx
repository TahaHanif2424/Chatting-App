import ChatListItem from '../../b-level/Chats/ChatListItem';
import '../../../App.css';
import { getAllGroups, getAllUsers } from './function';
import { useQuery } from '@tanstack/react-query';
import { useState, type Key } from 'react';
import Loader from '../../c-level/Loader';
import type { activeUser } from './types';
import { ADD_GROUP_URL, DEFAULT_AVATAR_URL } from '../../../constants/constants';

export default function ChatListContainer({setActivatedUser, setAddGroup, setAddMembers}) {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
  const { data: groupsData, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['groups'],
    queryFn: getAllGroups,
  });
  if (usersLoading || groupsLoading) {
    return <Loader/>;
  }

  if (usersError || groupsError) {
    return <div className="p-4 text-red-500">Error fetching data</div>;
  }
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Header with gradient */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold text-white">ChatApp Pro</h1>
        <p className="text-purple-100 text-xs mt-0.5">Stay connected with everyone</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Add Group Button */}
        <div className="p-3">
          <div
            onClick={() => {setAddGroup(true); setAddMembers(false)}}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-lg cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm">Create New Group</p>
              <p className="text-xs text-gray-500 truncate">Start a group conversation</p>
            </div>
          </div>
        </div>
        
        {/* Groups Section */}
        {groupsData?.groups?.length > 0 && (
          <div className="px-3 pb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Groups</p>
            {groupsData.groups.map((group: {
              id: Key | null | undefined; 
              group: { id: string; name: string }
            }) => (
              <div
                key={`group-${group.group.id}`}
                onClick={() => {setActivatedUser({userId:group.group.id, name:group.group.name, avatar:DEFAULT_AVATAR_URL, isGroup: true}); setAddMembers(false)}}
                className="flex items-center gap-3 p-2.5 mb-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{group.group.name}</p>
                  <p className="text-xs text-gray-500">Group chat</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              </div>
            ))}
          </div>
        )}

        {/* Direct Messages Section */}
        {usersData?.length > 0 && (
          <div className="px-3 pb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Direct Messages</p>
            {usersData.map((chat: {
              avatar: string; id: Key | null | undefined; name: string 
            }) => (
              <div
                key={`user-${chat.id}`}
                onClick={() => {setActivatedUser({userId:chat.id,name:chat.name,avatar:chat.avatar, isGroup: false})}}
                className="flex items-center gap-3 p-2.5 mb-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-all group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar || DEFAULT_AVATAR_URL}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-purple-300 transition-colors"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{chat.name}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}