import React from 'react';
import { Background } from '../types';

interface BackgroundSelectorProps {
    backgrounds: Background[];
    selectedBackground: Background;
    onSelectBackground: (background: Background) => void;
    customBackgroundPrompt: string;
    onCustomBackgroundChange: (prompt: string) => void;
    isDisabled: boolean;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
    backgrounds, 
    selectedBackground, 
    onSelectBackground, 
    customBackgroundPrompt,
    onCustomBackgroundChange,
    isDisabled 
}) => {
    const isCustomSelected = selectedBackground?.id === 'custom';

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {backgrounds.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => onSelectBackground(bg)}
                        disabled={isDisabled}
                        className={`p-4 border rounded-lg text-left transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkedin-blue ${
                            selectedBackground?.id === bg.id 
                            ? 'border-linkedin-blue bg-blue-50 shadow-md ring-2 ring-linkedin-blue' 
                            : 'hover:border-linkedin-blue hover:shadow-sm'
                        }`}
                    >
                        <h3 className={`text-lg font-bold ${selectedBackground?.id === bg.id ? 'text-linkedin-blue' : 'text-gray-800'}`}>{bg.name}</h3>
                    </button>
                ))}
            </div>
            {isCustomSelected && (
                 <div className="mt-4">
                    <input
                        type="text"
                        value={customBackgroundPrompt}
                        onChange={(e) => onCustomBackgroundChange(e.target.value)}
                        placeholder="e.g., a serene beach at sunset"
                        disabled={isDisabled}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin-blue transition-colors duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        aria-label="Custom background prompt"
                    />
                </div>
            )}
        </div>
    );
};