import { DEFAULT_AVATAR_URL } from "../../../constants/constants";
import type { chatItem } from "../types-b";

export default function ChatListItem({ avatar, name, onclick}: chatItem) {

  return (
    <div className="flex items-center p-4 hover:bg-gray-100 rounded-xl w-full"  onClick={onclick}>
      <img
        src={avatar || DEFAULT_AVATAR_URL}
        alt={`${name} avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">{name}</span>
        </div>
      </div>
    </div>
  );
}
