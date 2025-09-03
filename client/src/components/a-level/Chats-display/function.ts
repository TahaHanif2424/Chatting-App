import axiosInstance from "../../../lib/axiosInstance"
import type { sendMessage } from "./types";

export const getAllUsers = async () => {
    const response = await axiosInstance.get('/user/chats');
    return response.data;
}
export const getAllGroups = async () => {
    const response = await axiosInstance.get('/group');
    return response.data;
}


export const sendMessageFn = async ({ payload, toId, groupId }: sendMessage) => {
    try {
        console.log(payload, toId, groupId);
        console.log("Sending message to:", toId ? toId : groupId);
        if (!toId && !groupId) {
            throw new Error("Both toID and groupID cannot be null");
        };
        if (!payload) {
            throw new Error("Cannot send empty message");
        }
        const response=await axiosInstance.post('/message', {
            payload,
            toId: toId ? toId : null,
            groupId: groupId ? groupId : null,
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


export const getMessageforUser = async (toId: string) => {
    try {
        if (!toId)
            throw new Error("toId is not present");
        const response = await axiosInstance.get(`/message/${toId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getMessageforGroup = async (groupId: string) => {
    try {
        if (!groupId)
            throw new Error("toId is not present");
        const response = await axiosInstance.get(`/group/messages/${groupId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}