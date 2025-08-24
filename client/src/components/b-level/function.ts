import axiosInstance from "../../lib/axiosInstance";

export const getavatars=async()=>{
    const avatars=await axiosInstance.get("/auth/avatar");
    console.log(avatars.data);
    return avatars.data;
}