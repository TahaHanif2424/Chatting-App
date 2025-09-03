import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getavatars } from './function';
import Loader from '../c-level/Loader';
import { Check, X, User } from 'lucide-react';

export default function AvatarSelector({ avatar,display }) {
    const [selected, setSelected] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['avatar'],
        queryFn: getavatars
    });

    const handleOk = () => {
        if (selected) {
            avatar(selected);
            display(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-2xl border border-purple-100 animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl"></div>
                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Choose Avatar</h2>
                    </div>

                    {/* Avatar Grid */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar mb-6">
                        <div className="grid grid-cols-4 gap-4">
                            {data.map((avatar, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelected(avatar.avatarURL)}
                                    className={`relative border-2 rounded-xl p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                        selected === avatar.avatarURL
                                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                                            : 'border-gray-200 hover:border-purple-300 bg-white'
                                    }`}
                                >
                                    <img
                                        src={avatar.avatarURL}
                                        alt={`Avatar ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg"
                                    />
                                    {selected === avatar.avatarURL && (
                                        <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-1">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => display(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
                            disabled={!selected}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                        >
                            <Check className="w-4 h-4" />
                            Select
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
