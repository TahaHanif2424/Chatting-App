import ChatListItem from '../../b-level/Chats/ChatListItem';
import '../../../App.css';
import { getAllUsers } from './function';
import { useQuery } from '@tanstack/react-query';
import { type Key } from 'react';
import Loader from '../../c-level/Loader';
import type { activeUser } from './types';

export default function ChatListContainer({setActivatedUser}:activeUser) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
  if (isLoading) {
    return <Loader/>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error fetching users</div>;
  }
  return (
    <div className="w-full mx-auto border border-gray-300 rounded-2xl bg-white shadow-lg no-scrollbar">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 rounded-lg bg-[#1E3A8A]">
        <h1 className="text-lg font-semibold text-white">ChatApp Pro</h1>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-200">
        {data?.map((chat: {
          avatar: string; id: Key | null | undefined; name: string 
}) => (
          <ChatListItem
            key={chat.id}
            avatar={chat.avatar}
            name={chat.name}
            onclick={()=>{setActivatedUser({userId:chat.id,name:chat.name,avatar:chat.avatar})}}
          />
        ))}
      </div>
    </div>
  );
}
