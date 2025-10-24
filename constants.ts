import { Filter, Background } from './types';

export const FILTERS: Filter[] = [
    {
        id: 'confident',
        name: 'Confident',
        description: 'Sharp, modern, and competent.',
        prompt: 'A professional LinkedIn headshot of a confident, competent person in business wear. The lighting is sharp and polished.',
    },
    {
        id: 'approachable',
        name: 'Approachable',
        description: 'Warm, friendly, and open.',
        prompt: 'A professional LinkedIn headshot of a friendly, approachable person with a warm, slight smile. The attire is smart-casual. The lighting is soft and flattering.',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Dynamic, unique, and engaging.',
        prompt: 'A creative and dynamic professional headshot for an arts or tech professional. The expression is engaging and thoughtful, with stylish attire and slightly dramatic lighting.',
    },
    {
        id: 'formal',
        name: 'Formal',
        description: 'Classic, traditional, and corporate.',
        prompt: 'A formal corporate headshot. The person has a neutral, professional expression, wearing a formal business suit with classic studio lighting.',
    },
];

export const BACKGROUNDS: Background[] = [
    {
        id: 'office',
        name: 'Modern Office',
        promptFragment: 'a blurred, modern office setting',
    },
    {
        id: 'bookshelf',
        name: 'Library / Bookshelf',
        promptFragment: 'a softly-focused library with bookshelves',
    },
    {
        id: 'cafe',
        name: 'Outdoor Cafe',
        promptFragment: 'an outdoor cafe with a very blurred background',
    },
    {
        id: 'neutral',
        name: 'Neutral Wall',
        promptFragment: 'a solid, neutral-colored studio wall',
    },
    {
        id: 'custom',
        name: 'Custom...',
        promptFragment: '', // This will be replaced by user input
    }
];