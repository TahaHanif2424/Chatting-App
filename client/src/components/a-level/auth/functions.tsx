import { DEFAULT_AVATAR_URL } from "../../../constants/constants";
import axiosInstance from "../../../lib/axiosInstance"
import type { logindata, signupdata } from "./types";

export const signup = async (signupdata: signupdata) => {
    if (signupdata.email === '' || signupdata.name === '' || signupdata.password === '' || signupdata.confirmPassword === '') {
        alert("Empty credentials");
        throw new Error("Empty credentials");
    }
    if (signupdata.password !== signupdata.confirmPassword) {
        alert("Password does not match")
        throw new Error("Password does not match");
    }
    try {
        const response = await axiosInstance.post("/auth/signup", {
            email: signupdata.email,
            name: signupdata.name,
            password: signupdata.password,
            confirmPassword: signupdata.confirmPassword,
            avatar: signupdata.avatar || DEFAULT_AVATAR_URL,
        });
        if(response.data){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}
export const login = async (loginData: logindata) => {
    if (loginData.email === '' || loginData.password === '') {
        alert("Empty credentials");
        throw new Error("Empty credentials");
    }
    try {
        const response = await axiosInstance.post("/auth/login", {
            email: loginData.email,
            password: loginData.password
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}