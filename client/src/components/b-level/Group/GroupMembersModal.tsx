import { useEffect, useRef } from "react";
import { Users, X, Crown, User } from "lucide-react";

type Props = {
  onClose: () => void;
  members: { user: object}[];
};

export default function GroupMembersModal({ onClose, members }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 animate-fade-in"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Group Members
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Active now</span>
            </div>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Members List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              {members.map((member, index) => (
                <div 
                  key={member.user.id} 
                  className="group relative bg-white/70 hover:bg-white/90 border border-gray-200 hover:border-purple-300 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {member.user.avatar ? (
                        <img 
                          src={member.user.avatar} 
                          alt={member.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      {/* Admin Crown for first member */}
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 shadow-lg">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                      
                      {/* Online Status */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {member.user.name}
                        </h3>
                        {index === 0 && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                            <Crown className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {member.user.email || 'Active now'}
                      </p>
                    </div>
                    
                    {/* Member Number */}
                    <div className="text-xs text-gray-400 font-medium">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Users className="w-5 h-5" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
