// Vercel's Request and Response types are compatible with the Node HTTP types
import http from 'http';

export default function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
    
    try {
        const config = {
            clerkPublishableKey: process.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
            geminiApiKey: process.env.PUBLIC_GEMINI_API_KEY,
        };

        if (!config.clerkPublishableKey || !config.geminiApiKey) {
            console.error('Missing required public environment variables on the server.');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Server configuration error. Please check environment variables.' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(config));

    } catch (error) {
        console.error('Error in /api/config:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}
