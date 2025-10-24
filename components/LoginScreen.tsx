import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const LinkedInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.94 0-1.62.61-1.62 1.93V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.38.99 3.38 3.3V19z"></path>
    </svg>
);

export const LoginScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl text-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Welcome to <span className="text-linkedin-blue">Headshot AI</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Generate your perfect professional profile picture in seconds.
                    </p>
                </div>

                <div className="py-4">
                    <img src="https://picsum.photos/seed/headshot-demo/400/250" alt="Professional Headshots" className="rounded-lg shadow-md mx-auto" />
                </div>
                
                <p className="text-sm text-gray-500">
                    Sign in to get started.
                </p>

                <SignInButton mode="modal">
                    <button
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 text-lg font-semibold text-white bg-linkedin-blue rounded-lg hover:bg-linkedin-hover focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-300"
                    >
                        <LinkedInIcon />
                        Sign in or Sign up
                    </button>
                </SignInButton>
                <p className="text-xs text-gray-400 mt-4">Secure sign-in powered by Clerk.</p>
            </div>
        </div>
    );
};