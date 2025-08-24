 export type signupdata={
    email:string,
    name:string,
    password:string,
    confirmPassword:string,
    avatar:string
 }
 export type logindata={
    email:string,
    password:string,
 }
 export interface AuthProp {
  changeMode: () => void;
}