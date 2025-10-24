import React from 'react';

interface ImageDisplayProps {
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
         <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 font-semibold">Generating your headshot...</p>
            <p className="text-sm">This may take a moment.</p>
        </div>
    </div>
);

const Placeholder: React.FC = () => (
     <div className="w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 font-semibold">Your generated image will appear here.</p>
        </div>
    </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImage, isLoading, error }) => {
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="w-full aspect-square bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
                <div className="text-center text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 font-bold">Generation Failed</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (generatedImage) {
        return (
            <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                <img src={generatedImage} alt="Generated AI Headshot" className="w-full h-full object-cover" />
                <a
                    href={generatedImage}
                    download="linkedin-headshot.png"
                    className="absolute bottom-4 right-4 bg-linkedin-blue text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Download image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </a>
            </div>
        );
    }

    return <Placeholder />;
};