import React, { useState } from 'react'
import Input from '../../c-level/Input'
import ListofUsers from '../List-of-Users'
import { getAllUsers } from '../../a-level/Chats-display/function';
import { useQuery } from '@tanstack/react-query';
import type { ChatWindowProps, users } from '../types-b';
import Button from '../../c-level/Button';
import { ArrowLeft, UserPlus, Search, Users } from 'lucide-react';
import useAddMember from './useAddMember';
import { searchUser } from '../function';

export default function AddMember({ setAddMembers, activatedUser }: ChatWindowProps) {
  const [trash, setTrash] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });
  const { data: searchResults } = useQuery({
    queryKey: ['searchUser', searchTerm],
    queryFn: () => searchUser(searchTerm),
    enabled: !!searchTerm,
  });
  const [selectedUsers, setSelectedUsers] = useState<users[]>([]);
  const { addMemberMutation } = useAddMember();
  const addUsers = (user: users) => {
    console.log(user);
    setSelectedUsers([...selectedUsers, user]);
  }

  const handleAddMembers = () => {
    if (selectedUsers.length > 0 && activatedUser.userId) {
      const userIds = selectedUsers.map(user => user.id);
      addMemberMutation.mutate({ groupId: activatedUser.userId, userIds });
    }
  }
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
      {/* Header */}
      <div className='relative bg-white/95 backdrop-blur-md border-b border-purple-100 p-6'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5'></div>
        <div className='relative z-10 flex items-center justify-between max-w-6xl mx-auto'>
          <button 
            className='inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            onClick={() => { if (setAddMembers) setAddMembers(false) }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className='text-center'>
            <div className='inline-flex p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-2'>
              <UserPlus className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
              Add Members
            </h1>
            <p className='text-gray-500 mt-1'>Select users to add to {activatedUser.name}</p>
          </div>
          
          <div className='w-24'></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]'>
          {/* Search Users Panel */}
          <div className='relative bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-purple-100'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl'></div>
            <div className='relative z-10 p-6 h-full flex flex-col'>
              {/* Search Header */}
              <div className='flex items-center gap-3 mb-6'>
                <div className='inline-flex p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl'>
                  <Search className='w-5 h-5 text-white' />
                </div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                  Search Users
                </h2>
              </div>
              
              {/* Search Input */}
              <div className='relative mb-4'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <Input
                  type="text"
                  name="text"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                  placeholder="Search users by name..."
                  onChange={(event) => {handleSearch(event)}}
                />
              </div>

              {/* Users List */}
              <div className='flex-1 overflow-y-auto custom-scrollbar'>
                <ListofUsers list={users} searchedUser={searchResults || []} isLoading={isLoading} error={error} onClick={addUsers} />
              </div>
            </div>
          </div>

          {/* Selected Users Panel */}
          <div className='relative bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-purple-100'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl'></div>
            <div className='relative z-10 p-6 h-full flex flex-col'>
              {/* Selected Header */}
              <div className='flex items-center gap-3 mb-6'>
                <div className='inline-flex p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl'>
                  <Users className='w-5 h-5 text-white' />
                </div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                  Selected Users
                </h2>
                <div className='ml-auto bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>
                  {selectedUsers.length}
                </div>
              </div>
              
              {/* Selected Users Content */}
              <div className='flex-1 flex flex-col'>
                {selectedUsers.length === 0 ? (
                  <div className='flex-1 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='inline-flex p-6 bg-gray-100 rounded-full mb-4'>
                        <Users className='w-12 h-12 text-gray-400' />
                      </div>
                      <p className='text-gray-500 text-lg'>No users selected</p>
                      <p className='text-gray-400 text-sm mt-1'>Choose users from the search panel</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='flex-1 overflow-y-auto custom-scrollbar mb-6'>
                      <ListofUsers list={selectedUsers} setList={setSelectedUsers} isLoading={isLoading} error={error} trash={trash} />
                    </div>
                    <Button
                      className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2'
                      onClick={handleAddMembers}
                      disabled={addMemberMutation.isPending}
                    >
                      {addMemberMutation.isPending ? (
                        <>
                          <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                          Adding Members...
                        </>
                      ) : (
                        <>
                          <UserPlus className='w-5 h-5' />
                          Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''} to Group
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
