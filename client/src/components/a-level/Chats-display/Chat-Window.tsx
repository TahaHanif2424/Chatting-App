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
import Button from '../../c-level/Button';
import { useChat } from './useChat';
import { DEFAULT_AVATAR_URL } from '../../../constants/constants';

type ActivatedUser = {
  userId: string;
  name: string;
  avatar: string;
  isGroup: boolean;
};

export default function ChatWindow({ activatedUser }: { activatedUser: ActivatedUser }) {
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
  } = useChat(activatedUser.userId, activatedUser.isGroup);

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
    <div className="flex flex-col h-full bg-gray">

      {activatedUser.userId ? (<><div className="flex items-center justify-between bg-white px-4 py-3 border-b shadow-sm">
        <div className="flex items-center">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
          <img
            src={activatedUser.avatar}
            alt={`${activatedUser.name} avatar`}
            className="w-8 h-8 rounded-full ml-3 object-cover" />
          <span className="ml-3 text-gray-900 font-medium">{activatedUser.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <PhoneCall className="w-6 h-6 text-gray-600 cursor-pointer" />
          <Video className="w-6 h-6 text-gray-600 cursor-pointer" />
          <MoreVertical className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
          {(activatedUser.isGroup ? groupMessages : messages).length > 0 ? (
            (activatedUser.isGroup ? groupMessages : messages).map((msg) => {
              const isFromMe = currentUser?.id === msg.fromId;
              return (
                <div key={msg.id} className={`mb-3 flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                  {!isFromMe && (
                    <img
                      src={msg.from?.avatar || DEFAULT_AVATAR_URL}
                      alt={msg.from.name}
                      className="w-8 h-8 rounded-full mr-2 mt-1 object-cover"
                    />
                  )}
                  <div className={`max-w-xs p-2 rounded-lg ${isFromMe
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-900'} shadow`}>
                    <p className="text-xs font-bold text-gray-600 mb-1">{msg.from.name}</p>
                    <p className="text-sm">{msg.payload}</p>
                    {msg.createdAt && (
                      <span
                        className={`text-[10px] mt-1 block text-right ${isFromMe ? 'text-green-100' : 'text-gray-500'}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  {isFromMe && (
                    <img
                      src={msg.from?.avatar || DEFAULT_AVATAR_URL}
                      alt="You"
                      className="w-8 h-8 rounded-full ml-2 mt-1 object-cover"
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No messages</div>
          )}
        </div>


        <form onSubmit={handleSubmit} className="flex items-center bg-white px-4 py-2 border-t">
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
            <Button type="submit" className="p-2 bg-green-500 rounded-full focus:outline-none">
              <Send className="w-5 h-5 text-white rotate-90" />
            </Button>
          ) : (
            <button type="button" className="p-2 bg-green-500 rounded-full focus:outline-none">
              <Mic className="w-5 h-5 text-white" />
            </button>
          )}
        </form>
      </>) : (
        <div className="flex items-center justify-center h-screen font-bold text-xl">
          Select user to continue chat
        </div>

      )}

    </div>
  );
}
