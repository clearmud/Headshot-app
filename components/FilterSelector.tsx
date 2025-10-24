import React from 'react';
import { Filter } from '../types';

interface FilterSelectorProps {
    filters: Filter[];
    selectedFilter: Filter | null;
    onSelectFilter: (filter: Filter) => void;
    isDisabled: boolean;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({ filters, selectedFilter, onSelectFilter, isDisabled }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onSelectFilter(filter)}
                    disabled={isDisabled}
                    className={`p-4 border rounded-lg text-left transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkedin-blue ${
                        selectedFilter?.id === filter.id 
                        ? 'border-linkedin-blue bg-blue-50 shadow-md ring-2 ring-linkedin-blue' 
                        : 'hover:border-linkedin-blue hover:shadow-sm'
                    }`}
                >
                    <h3 className={`text-lg font-bold ${selectedFilter?.id === filter.id ? 'text-linkedin-blue' : 'text-gray-800'}`}>{filter.name}</h3>
                    <p className="text-sm text-gray-500">{filter.description}</p>
                </button>
            ))}
        </div>
    );
};
