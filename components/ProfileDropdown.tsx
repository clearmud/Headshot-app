import React from 'react';

interface ProfileDropdownProps {
    onUpgrade: () => void;
    onSignOut: () => void;
    onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onUpgrade, onSignOut, onClose }) => {
    
    const handleUpgrade = () => {
        onUpgrade();
        onClose();
    };

    const handleSignOut = () => {
        onSignOut();
        onClose();
    };

    const handleManageBilling = () => {
        // In a real app, this would redirect to a Stripe customer portal
        alert("This would take you to the Stripe billing portal.");
        onClose();
    };

    return (
        <div 
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
            role="menu"
            aria-orientation="vertical"
        >
            <div className="py-1" role="none">
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm font-medium border-b" role="menuitem">
                    Signed in as <br/> <span className="font-bold">Jane Doe</span>
                </a>
                <button
                    onClick={handleUpgrade}
                    className="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                >
                    Upgrade Account
                </button>
                <button
                    onClick={handleManageBilling}
                    className="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                >
                    Manage Billing
                </button>
                <button
                    onClick={handleSignOut}
                    className="w-full text-left text-red-600 block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};