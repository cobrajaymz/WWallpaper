import React from 'react';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center -mt-20">
            <div className="max-w-md">
                <p className="text-xl text-slate-400">
                    Find your next wallpaper. Start by searching above or clicking a tag.
                </p>
            </div>
        </div>
    );
};
