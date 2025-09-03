import axiosInstance from "../../lib/axiosInstance";

export const getavatars=async()=>{
    const avatars=await axiosInstance.get("/auth/avatar");
    return avatars.data;
}

export const createGroup=async(name:string)=>{

    const group=await axiosInstance.post("/group",{name});
    return group.data;
}

export const addMembersToGroup=async({groupId, userIds}:{groupId:string, userIds:string[]})=>{
    console.log("Adding members to group:", groupId, userIds);
    const response=await axiosInstance.post("/group/join",{groupId, userIds});
    return response.data;
}

export const searchUser=async(name:string)=>{
    console.log("Searching users with query:", name);
    const response=await axiosInstance.get(`/group/addUser`, { params: { name } });
    return response.data;
}

export const getGroupMembers=async(groupId:string)=>{
    console.log(groupId)
    const response=await axiosInstance.get(`/group/members`, { params: { groupId } });
    return response.data;
}   

export const leaveGroup=async(groupId:string)=>{
    console.log(groupId);
    const response= await axiosInstance.delete('/group/leave', { params: { groupId } });
    return response.data;
}