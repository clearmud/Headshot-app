import React from 'react';
import { UserButton } from '@clerk/clerk-react';
// FIX: Corrected the import for UserResource. It's exported from '@clerk/types', not '@clerk/clerk-react'.
import type { UserResource as User } from '@clerk/types';

interface HeaderProps {
    user: User | null | undefined;
    generationsLeft: number;
    onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, generationsLeft, onGoHome }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={onGoHome} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkedin-blue rounded-md">
                    <h1 className="text-2xl font-bold text-linkedin-blue">Headshot AI</h1>
                </button>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="font-semibold text-gray-700">{user?.fullName || 'User'}</p>
                        <p className="text-sm text-gray-500">Generations left: <span className="font-bold text-indigo-600">{generationsLeft}</span></p>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
};