import React from 'react';

interface PricingScreenProps {
    onPurchase: (plan: 'pro' | 'business') => void;
    onBack: () => void;
}

const CheckIcon = () => (
    <svg className="w-5 h-5 text-linkedin-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const PricingScreen: React.FC<PricingScreenProps> = ({ onPurchase, onBack }) => {
    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
             <div className="max-w-4xl mx-auto text-center">
                <button onClick={onBack} className="text-sm text-gray-600 hover:text-linkedin-blue mb-4">&larr; Back to Generator</button>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Find the Perfect Plan</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Start for free, then upgrade to unlock high-resolution headshots and more.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="border rounded-xl p-8 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">$0</p>
                    <p className="text-gray-500 mt-2">Get started</p>
                    <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                        <li className="flex items-center gap-3"><CheckIcon /> 1 Free Credit</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Standard Resolution</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Watermarked Images</li>
                    </ul>
                    <button disabled className="mt-8 w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
                        Your Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                 <div className="border-2 border-linkedin-blue rounded-xl p-8 flex flex-col relative shadow-2xl">
                    <span className="absolute top-0 -translate-y-1/2 bg-linkedin-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Recommended</span>
                    <h3 className="text-2xl font-bold text-linkedin-blue">Pro</h3>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">$19.99</p>
                    <p className="text-gray-500 mt-2">One-time purchase</p>
                    <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                        <li className="flex items-center gap-3"><CheckIcon /> 50 Generations</li>
                        <li className="flex items-center gap-3"><CheckIcon /> High Resolution</li>
                        <li className="flex items-center gap-3"><CheckIcon /> No Watermark</li>
                         <li className="flex items-center gap-3"><CheckIcon /> All Styles & Backgrounds</li>
                    </ul>
                    <button onClick={() => onPurchase('pro')} className="mt-8 w-full bg-linkedin-blue hover:bg-linkedin-hover text-white font-bold py-3 rounded-lg transition-colors">
                        Purchase Pro
                    </button>
                </div>

                {/* Business Plan */}
                <div className="border rounded-xl p-8 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900">Business</h3>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">$49.99</p>
                    <p className="text-gray-500 mt-2">One-time purchase</p>
                    <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                        <li className="flex items-center gap-3"><CheckIcon /> 150 Generations</li>
                        <li className="flex items-center gap-3"><CheckIcon /> High Resolution</li>
                        <li className="flex items-center gap-3"><CheckIcon /> No Watermark</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Custom Backgrounds</li>
                        <li className="flex items-center gap-3"><CheckIcon /> Priority Support</li>
                    </ul>
                    <button onClick={() => onPurchase('business')} className="mt-8 w-full bg-gray-800 hover:bg-black text-white font-bold py-3 rounded-lg transition-colors">
                        Purchase Business
                    </button>
                </div>
            </div>
             <p className="text-center text-xs text-gray-400 mt-8">This is a simulated Stripe checkout process.</p>
        </main>
    );
};