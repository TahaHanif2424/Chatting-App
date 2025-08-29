import type { StringSchema } from "yup";
import axiosInstance from "../../lib/axiosInstance";

export const getavatars=async()=>{
    const avatars=await axiosInstance.get("/auth/avatar");
    return avatars.data;
}

export const createGroup=async(name:string)=>{

    const group=await axiosInstance.post("/group",{name});
    return group.data;
}