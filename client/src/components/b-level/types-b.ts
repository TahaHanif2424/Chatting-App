export type chatItem={
   avatar?: string; name: string; onclick:()=>void;
}
export type users={
   id:string,name:string,avatar:string
}

export type ActivatedUser = {
  userId: string;
  name: string;
  avatar: string;
  isGroup: boolean;
};

export type ChatWindowProps = {
  activatedUser: ActivatedUser;
  setAddMembers?: (value: boolean) => void;
  setShowGroupMembers?: (value: boolean) => void;
};