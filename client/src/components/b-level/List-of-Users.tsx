import Loader from '../c-level/Loader';
import ErrorPage from '../a-level/Error';
import ChatListItem from './Chats/ChatListItem';
import { Trash } from "lucide-react";

interface ListofUsersProps {
    list: { id: string; name: string; avatar: string }[] | undefined;
    isLoading: boolean;
    error: unknown;
    onClick?: (user: { id: string; name: string; avatar: string }) => void;
    trash?: boolean;
    setList?:(users:{ id: string; name: string; avatar: string }[])=>void;
    searchedUser?: { id: string; name: string; avatar: string }[] | undefined;
}

export default function ListofUsers({list, isLoading, error, onClick, trash, setList, searchedUser}: ListofUsersProps) {

    const removeUser=(id:string)=>{
        if(setList){
            setList(list?.filter(user=>user.id!==id) || []);
        }
    }
    if(isLoading){
        return <Loader/>
    }
    if(error){
        return <ErrorPage/>
    }   
  return (
    <div className='flex flex-col gap-4 p-4 shadow-lg rounded-lg bg-white h-full overflow-y-auto' >
        {!trash && searchedUser && searchedUser.length>0 ? searchedUser.map((user:{id:string,name:string,avatar:string})=>(
            <div className='flex justify-between items-center rounded-lg shadow pr-2 hover:bg-gray-100'>
                <ChatListItem
                key={user.id}
                name={user.name}
                avatar={user.avatar}
                onclick={() => onClick && onClick({ id: user.id, name: user.name, avatar: user.avatar })} />
                {trash &&<Trash className="w-6 h-6 text-red-600 cursor-pointer" onClick={()=>removeUser(user.id)}/>}</div>
        )):
    
        list?.map((user:{id:string,name:string,avatar:string})=>(
            <div className='flex justify-between items-center rounded-lg shadow pr-2 hover:bg-gray-100'>
                <ChatListItem
                key={user.id}
                name={user.name}
                avatar={user.avatar}
                onclick={() => onClick && onClick({ id: user.id, name: user.name, avatar: user.avatar })} />
                {trash &&<Trash className="w-6 h-6 text-red-600 cursor-pointer" onClick={()=>removeUser(user.id)}/>}</div>
        ))}
    </div>
  )
}
