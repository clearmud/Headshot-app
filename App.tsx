import React, { useState, useCallback, useEffect } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { FilterSelector } from './components/FilterSelector';
import { BackgroundSelector } from './components/BackgroundSelector';
import { ImageDisplay } from './components/ImageDisplay';
import { PricingScreen } from './components/PricingScreen';
import { generateHeadshot } from './services/geminiService';
import { Filter, Background } from './types';
import { FILTERS, BACKGROUNDS } from './constants';

type AppView = 'generator' | 'pricing';

const App: React.FC = () => {
    return (
        <>
            <SignedOut>
                <LoginScreen />
            </SignedOut>
            <SignedIn>
                <GeneratorApp />
            </SignedIn>
        </>
    );
};

const GeneratorApp: React.FC = () => {
    const { user } = useUser();
    // Generations are now managed by Clerk's metadata
    const [generationsLeft, setGenerationsLeft] = useState<number>(0);
    
    useEffect(() => {
        if (user) {
            // Check if metadata is initialized
            const credits = user.publicMetadata.generationsLeft as number | undefined;
            if (typeof credits === 'number') {
                setGenerationsLeft(credits);
            } else {
                // First time user, grant them 1 free credit
                const initialCredits = 1;
                setGenerationsLeft(initialCredits);
                // FIX: Bypassing a TypeScript error with 'as any'. The 'publicMetadata' property
                // is valid for user.update, but may be missing from the type definitions
                // in the version of @clerk/clerk-react being used.
                user.update({
                    publicMetadata: { ...user.publicMetadata, generationsLeft: initialCredits }
                } as any).catch(console.error);
            }
        }
    }, [user]);


    const [userImage, setUserImage] = useState<string | null>(null);
    const [userImageMimeType, setUserImageMimeType] = useState<string | null>(null);
    
    const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
    const [selectedBackground, setSelectedBackground] = useState<Background>(BACKGROUNDS[0]);
    const [customBackgroundPrompt, setCustomBackgroundPrompt] = useState<string>('');

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [currentView, setCurrentView] = useState<AppView>('generator');

    const handleGoHome = () => setCurrentView('generator');

    const handleImageUpload = (base64Image: string, mimeType: string) => {
        setUserImage(base64Image);
        setUserImageMimeType(mimeType);
        setGeneratedImage(null);
        setError(null);
    };

    const handleGenerate = useCallback(async () => {
        if (!userImage || !userImageMimeType || !selectedFilter || !selectedBackground) {
            setError("Please upload an image and select a style and background.");
            return;
        }
        if (selectedBackground.id === 'custom' && customBackgroundPrompt.trim() === '') {
            setError("Please enter a custom background description.");
            return;
        }
        if (generationsLeft <= 0) {
            setCurrentView('pricing');
            return;
        }

        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        const backgroundPrompt = selectedBackground.id === 'custom'
            ? `a ${customBackgroundPrompt.trim()}`
            : selectedBackground.promptFragment;

        const finalPrompt = `${selectedFilter.prompt} The background is ${backgroundPrompt}. Maintain the subject's facial features from the original image.`;

        try {
            const result = await generateHeadshot(userImage, userImageMimeType, finalPrompt);
            setGeneratedImage(`data:image/png;base64,${result}`);
            // Decrement credits in Clerk metadata
            const newCount = generationsLeft - 1;
            setGenerationsLeft(newCount);
            // FIX: Bypassing a TypeScript error with 'as any'. The 'publicMetadata' property
            // is valid for user.update, but may be missing from the type definitions
            // in the version of @clerk/clerk-react being used.
            await user?.update({ publicMetadata: { ...user.publicMetadata, generationsLeft: newCount } } as any);
        } catch (e) {
            console.error(e);
            const message = e instanceof Error ? e.message : "Failed to generate headshot. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [user, userImage, userImageMimeType, generationsLeft, selectedFilter, selectedBackground, customBackgroundPrompt]);
    
    const isCustomBackgroundValid = selectedBackground?.id !== 'custom' || (selectedBackground?.id === 'custom' && customBackgroundPrompt.trim() !== '');
    const canGenerate = userImage && selectedFilter && selectedBackground && isCustomBackgroundValid && !isLoading;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header 
                user={user}
                generationsLeft={generationsLeft} 
                onGoHome={handleGoHome}
            />
            {currentView === 'generator' ? (
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Controls */}
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">1. Upload Your Photo</h2>
                                <ImageUploader onImageUpload={handleImageUpload} />
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">2. Choose a Style</h2>
                                <FilterSelector 
                                    filters={FILTERS} 
                                    selectedFilter={selectedFilter}
                                    onSelectFilter={setSelectedFilter}
                                    isDisabled={!userImage}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">3. Choose a Background</h2>
                                <BackgroundSelector
                                    backgrounds={BACKGROUNDS}
                                    selectedBackground={selectedBackground}
                                    onSelectBackground={setSelectedBackground}
                                    customBackgroundPrompt={customBackgroundPrompt}
                                    onCustomBackgroundChange={setCustomBackgroundPrompt}
                                    isDisabled={!userImage}
                                />
                            </div>
                            
                            <div className="pt-4">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!canGenerate}
                                    className="w-full bg-gradient-to-r from-linkedin-blue to-indigo-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:from-linkedin-hover hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Headshot'
                                    )}
                                </button>
                            </div>

                            {generationsLeft <= 0 && !isLoading && (
                                <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                                    <p className="font-bold">You've used all your generations!</p>
                                    <p>Upgrade to generate more headshots.</p>
                                    <button
                                        onClick={() => setCurrentView('pricing')}
                                        className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                                    >
                                        Upgrade Now
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Right Column: Display */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Your AI Headshot</h2>
                            <ImageDisplay 
                                generatedImage={generatedImage} 
                                isLoading={isLoading} 
                                error={error} 
                            />
                        </div>
                    </div>
                </main>
            ) : (
                <PricingScreen 
                    onBack={() => setCurrentView('generator')}
                />
            )}
        </div>
    );
}

export default App;