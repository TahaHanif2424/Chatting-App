import React from 'react'
import { getAllUsers } from '../a-level/Chats-display/function';
import { useQuery } from '@tanstack/react-query';
import Loader from '../c-level/Loader';
import ErrorPage from '../a-level/Error';
import ChatListItem from './Chats/ChatListItem';

export default function ListofUsers() {
    const{data:users,isLoading,error}=useQuery({
        queryKey:['users'],
        queryFn:getAllUsers
    });

    if(isLoading){
        return <Loader/>
    }
    if(error){
        return <ErrorPage/>
    }   
  return (
    <div className='flex flex-col gap-4 p-4 border rounded-lg shadow-lg bg-white h-full overflow-y-auto'>
        {users?.map((user:{id:string,name:string,avatar:string})=>(
            <ChatListItem
                key={user.id}
                name={user.name}
                avatar={user.avatar}
                onclick={()=>{}}
            />
        ))}
    </div>
  )
}
