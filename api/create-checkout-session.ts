// Vercel's Request and Response types are compatible with the Node HTTP types
import http from 'http';
import { Clerk } from '@clerk/backend';
import Stripe from 'stripe';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

// Helper to parse body
async function parseJsonBody(req: http.IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', err => reject(err));
  });
}

export default async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }));
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const claims = await clerk.verifyToken(token);
        const userId = claims.sub;

        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Unauthorized: Invalid token' }));
        }

        const { priceId } = await parseJsonBody(req) as { priceId?: string };

        if (!priceId || typeof priceId !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing or invalid priceId' }));
        }
        
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
        if (!appUrl) {
            throw new Error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: `${appUrl}?payment=success`,
            cancel_url: appUrl,
            client_reference_id: userId,
        });

        if (!session.url) {
            throw new Error('Could not create Stripe Checkout session.');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: session.url }));

    } catch (error) {
        console.error('Error in create-checkout-session:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.writeHead(error.message.includes('Unauthorized') ? 401 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
    }
}