import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { geminiService } from './services/geminiService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

// Render a simple loading state while we fetch the configuration.
root.render(
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
    <svg className="animate-spin h-8 w-8 text-linkedin-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p style={{ marginTop: '1rem', color: '#4b5563' }}>Initializing...</p>
  </div>
);

async function main() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch configuration.' }));
            throw new Error(errorData.error || `Server responded with ${response.status}`);
        }
        const config = await response.json();

        if (!config.clerkPublishableKey || !config.geminiApiKey) {
            throw new Error("Incomplete configuration received from the server.");
        }
        
        // Initialize the Gemini service with the fetched key
        geminiService.initialize(config.geminiApiKey);

        // Now that we have the keys, render the full application
        root.render(
          <React.StrictMode>
            <ClerkProvider publishableKey={config.clerkPublishableKey}>
              <App />
            </ClerkProvider>
          </React.StrictMode>
        );
    } catch (error) {
        console.error("Failed to initialize the application:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        root.render(
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: 'red', padding: '2rem', textAlign: 'center' }}>
                <strong>Error:</strong> {errorMessage}
            </div>
        );
    }
}

main();
