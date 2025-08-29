import ChatListItem from '../../b-level/Chats/ChatListItem';
import '../../../App.css';
import { getAllGroups, getAllUsers } from './function';
import { useQuery } from '@tanstack/react-query';
import { useState, type Key } from 'react';
import Loader from '../../c-level/Loader';
import type { activeUser } from './types';
import { ADD_GROUP_URL, DEFAULT_AVATAR_URL } from '../../../constants/constants';

export default function ChatListContainer({setActivatedUser, setAddGroup}) {
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
    <div className="w-full mx-auto border border-gray-300 rounded-2xl bg-white shadow-lg no-scrollbar">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 rounded-lg bg-[#1E3A8A]">
        <h1 className="text-lg font-semibold text-white">ChatApp Pro</h1>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-200">
        <ChatListItem
            key="add-group"
            name={"Add Group"}
            avatar={ADD_GROUP_URL}
            onclick={()=>{setAddGroup(true)}}
          />
        
        {/* Groups Section */}
        {groupsData?.groups?.map((group: {
          id: Key | null | undefined; 
          group: { id: string; name: string }
        }) => (
          <ChatListItem
            key={`group-${group.group.id}`}
            avatar={DEFAULT_AVATAR_URL}
            name={`📁 ${group.group.name}`}
            onclick={()=>{setActivatedUser({userId:group.group.id, name:group.group.name, avatar:DEFAULT_AVATAR_URL, isGroup: true})}}
          />
        ))}

        {/* Users Section */}
        {usersData?.map((chat: {
          avatar: string; id: Key | null | undefined; name: string 
        }) => (
          <ChatListItem
            key={`user-${chat.id}`}
            avatar={chat.avatar}
            name={chat.name}
            onclick={()=>{setActivatedUser({userId:chat.id,name:chat.name,avatar:chat.avatar, isGroup: false})}}
          />
        ))}
      </div>
    </div>
  );
}
