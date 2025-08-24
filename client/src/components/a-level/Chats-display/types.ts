export type activeUser={
    name:string,
    avatar:string,
    userId:string
}
export type sendMessage={
    payload:string,
    toId?:string,
    groupId?:string
}