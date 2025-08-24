import { useState, useCallback } from 'react';
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
  Loader
} from 'lucide-react';
import Input from '../../c-level/Input';
import { useFormik } from 'formik';
import { getMessageforUser, sendMessageFn } from './function';
import Button from '../../c-level/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocketMessage } from '../../../hooks/useSocket';

export default function ChatWindow({ activatedUser }) {
  console.log("Selected User",activatedUser);
  const queryClient = useQueryClient();
  
  const handleNewMessage = useCallback((message: any) => {
    const queryKey = ['messages', activatedUser.userId];
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return [message];
      
      const messageExists = oldData.some((msg: any) => msg.id === message.id);
      if (messageExists) return oldData;
      
      return [...oldData, message];
    });
  }, [activatedUser.userId, queryClient]);

  useSocketMessage(handleNewMessage);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      payload: '',
      toId: activatedUser.userId || '',
      groupId: '',
      // fromId: loggedInUserId,
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!values.payload.trim()) return;
      console.log("Form Values:", values);
      await sendMessageFn(values);
      queryClient.invalidateQueries({ queryKey: ['messages', activatedUser.userId] });
      resetForm();
    }
  });

const { data, isLoading, error } = useQuery({
  queryKey: ['messages', activatedUser.userId],
  queryFn: () => getMessageforUser(activatedUser.userId),
  enabled: !!activatedUser.userId, 
});

if (isLoading) {
  return <Loader />;
}

if (error) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center text-red-500">
        <p>Error loading messages</p>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}
  return (
    <div className="flex flex-col h-full bg-gray">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b shadow-sm">
        <div className="flex items-center">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
          <img
            src={activatedUser.avatar}
            alt={`${activatedUser.name} avatar`}
            className="w-8 h-8 rounded-full ml-3 object-cover"
          />
          <span className="ml-3 text-gray-900 font-medium">{activatedUser.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <PhoneCall className="w-6 h-6 text-gray-600 cursor-pointer" />
          <Video className="w-6 h-6 text-gray-600 cursor-pointer" />
          <MoreVertical className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {data && data.length > 0 ? (
          data.map(msg => (
            <div
              key={msg.id}
              className={`max-w-xs mb-3 p-2 rounded-lg ${
                msg.fromMe
                  ? 'ml-auto bg-green-500 text-white'
                  : 'mr-auto bg-white text-gray-900'
              } shadow`}
            >
              <p className="text-sm">{msg.payload}</p>
              {msg.createdAt && (
                <span className="text-[10px] text-gray-700 mt-1 block text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages</div>
        )}
        
      </div>

      {/* Input Toolbar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white px-4 py-2 border-t"
      >
        <button type="button" className="p-1 focus:outline-none">
          <Smile className="w-6 h-6 text-gray-600" />
        </button>
        <button type="button" className="p-1 ml-2 focus:outline-none">
          <Paperclip className="w-6 h-6 text-gray-600" />
        </button>
        <button type="button" className="p-1 ml-2 focus:outline-none">
          <Camera className="w-6 h-6 text-gray-600" />
        </button>

        <Input
          name="payload"
          type="text"
          value={values.payload}
          onChange={handleChange}
          placeholder="Type a message"
          className="flex-1 mx-3 px-4 py-2 rounded-full bg-gray-200 focus:outline-none focus:bg-gray-100"
        />

        {values.payload.trim() ? (
          <Button
            type="submit"
            className="p-2 bg-green-500 rounded-full focus:outline-none"
          >
            <Send className="w-5 h-5 text-white rotate-90" />
          </Button>
        ) : (
          <button type="button" className="p-2 bg-green-500 rounded-full focus:outline-none">
            <Mic className="w-5 h-5 text-white" />
          </button>
        )}
      </form>
    </div>
  );
}
