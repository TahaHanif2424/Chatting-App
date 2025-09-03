import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessageforGroup, getMessageforUser, sendMessageFn } from './function';
import { useSocketMessage } from '../../../hooks/useSocket';
import type { Message, User } from './types';
import { leaveGroup } from '../../b-level/function';



export function useChat(activatedUserId?: string, isGroup?: boolean) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load the current user from localStorage once
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // React Query: fetch messages for the active user
  const {
    data: userMessages,
    isLoading: userLoading,
    error: userError,
  } = useQuery<Message[], Error>({
    queryKey: ['messages', activatedUserId],
    queryFn: () => getMessageforUser(activatedUserId!),
    enabled: !!activatedUserId && !isGroup,
  });

  const {
    data: groupMessages,
    isLoading: groupLoading,
    error: groupError,
  } = useQuery<Message[], Error>({
    queryKey: ['groupMessages', activatedUserId],
    queryFn: () => getMessageforGroup(activatedUserId!),
    enabled: !!activatedUserId && isGroup,
  });

  // Optimistically add incoming socket messages to the cache (if not duplicated)
  const handleNewMessage = useCallback(
    (message: Message) => {
      if (!activatedUserId) return;
      
      // Handle group messages
      if (message.groupId && isGroup) {
        const queryKey = ['groupMessages', activatedUserId];
        queryClient.setQueryData<Message[] | undefined>(queryKey, (oldData) => {
          if (!oldData) return [message];
          const exists = oldData.some((m) => m.id === message.id);
          if (exists) return oldData;
          return [...oldData, message];
        });
      }
      // Handle private messages
      else if (message.toId && !isGroup) {
        const queryKey = ['messages', activatedUserId];
        queryClient.setQueryData<Message[] | undefined>(queryKey, (oldData) => {
          if (!oldData) return [message];
          const exists = oldData.some((m) => m.id === message.id);
          if (exists) return oldData;
          return [...oldData, message];
        });
      }
    },
    [activatedUserId, queryClient, isGroup]
  );

  // Subscribe to socket stream
  useSocketMessage(handleNewMessage);

  // Form handling (kept with Formik to match your current approach)
  const formik = useFormik({
    initialValues: {
      payload: '',
      toId: !isGroup? activatedUserId :null,
      groupId: isGroup? activatedUserId :null,
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!values.payload.trim()) return;
      const result=await sendMessageFn(values);
      if(!result){
        alert("You cannot send message to this group");
      }
      // Ensure we refetch after sending
      if (activatedUserId && !isGroup) {
        queryClient.invalidateQueries({ queryKey: ['messages', activatedUserId] });
      }else if(activatedUserId && isGroup){
        queryClient.invalidateQueries({ queryKey: ['groupMessages', activatedUserId] });
      }
      resetForm();
    },
  });

  const leaveGroupMutation = useMutation({
        mutationFn: leaveGroup,
        onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['groups'] });
           alert('Group Leaved successfully')
        }
    });

  return {
    // data
    messages: userMessages ?? [],
    userLoading,
    userError,
    groupMessages: groupMessages ?? [],
    groupLoading,
    groupError,
    currentUser,

    // form
    values: formik.values,
    handleChange: formik.handleChange,
    handleSubmit: formik.handleSubmit,

    leaveGroupMutation
  };
}
