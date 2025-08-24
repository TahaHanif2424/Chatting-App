import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getavatars } from './function';
import Loader from '../c-level/Loader';

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
        } else {
            alert('Please select an avatar');
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Choose Your Avatar</h2>

            <div className="flex-1 w-full max-w-[90vw] overflow-y-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
                    {data.map((avatar, index) => (
                        <div
                            key={index}
                            onClick={() => setSelected(avatar.avatarURL)}
                            className={`border-2 rounded-xl p-3 cursor-pointer transition-transform hover:scale-105 ${
                                selected === avatar.avatarURL
                                    ? 'border-blue-600 shadow-lg'
                                    : 'border-gray-200'
                            }`}
                        >
                            <img
                                src={avatar.avatarURL}
                                alt="avatar"
                                className="w-20 h-20 object-cover mx-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 mb-4">
                <button
                    onClick={handleOk}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
