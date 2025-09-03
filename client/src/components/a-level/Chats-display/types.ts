export type sendMessage={
    payload:string,
    toId?:string,
    groupId?:string
}
export type User = { id: string };
export type Message = {
  id: string;
  fromId: string;
  toId?: string;
  groupId?: string;
  payload: string;
  createdAt?: string | number | Date;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
  to?: {
    id: string;
    name: string;
    avatar?: string;
  };
};