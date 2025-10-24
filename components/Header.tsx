import React, { useState, useRef, useEffect } from 'react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
    generationsLeft: number;
    onUpgrade: () => void;
    onSignOut: () => void;
    onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ generationsLeft, onUpgrade, onSignOut, onGoHome }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={onGoHome} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkedin-blue rounded-md">
                    <h1 className="text-2xl font-bold text-linkedin-blue">Headshot AI</h1>
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-4 cursor-pointer">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-gray-700">Jane Doe</p>
                            <p className="text-sm text-gray-500">Generations left: <span className="font-bold text-indigo-600">{generationsLeft}</span></p>
                        </div>
                        <img 
                            className="w-12 h-12 rounded-full border-2 border-linkedin-blue ring-2 ring-offset-2 ring-transparent group-hover:ring-linkedin-blue transition-all"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                            alt="User Avatar" 
                        />
                    </button>
                    {isDropdownOpen && (
                        <ProfileDropdown 
                            onUpgrade={onUpgrade}
                            onSignOut={onSignOut}
                            onClose={() => setIsDropdownOpen(false)}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};