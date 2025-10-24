// Use Vercel's provided Request and Response types
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Clerk } from '@clerk/backend';
import Stripe from 'stripe';
// FIX: Explicitly import Buffer to fix "Cannot find name 'Buffer'" error.
import { Buffer } from 'buffer';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// =======================================================================================
// LIVE STRIPE PRICE IDs
// These have been updated with the user's provided IDs.
// =======================================================================================
const creditsPerPlan: { [key: string]: number } = {
    'price_1SLrg5Lei7aFvMIKCxIl8UUJ': 50,      // Pro Plan
    'price_1SLrgKLei7aFvMIK2kRRaBw5': 150, // Business Plan
};
// =======================================================================================

// Vercel config to receive the raw body, which is required by Stripe
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to buffer the request stream
async function buffer(readable: VercelRequest) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Webhook signature verification failed: ${message}`);
        return res.status(400).send(`Webhook Error: ${message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.client_reference_id;
        if (!userId) {
            console.error('Webhook Error: Missing userId in session client_reference_id');
            return res.status(400).send('Webhook Error: Missing user identifier.');
        }

        try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
            const priceId = lineItems.data[0]?.price?.id;

            if (!priceId || !creditsPerPlan[priceId]) {
                 console.error(`Webhook Error: Unrecognized priceId '${priceId}'`);
                 return res.status(400).send('Webhook Error: Unrecognized product purchased.');
            }
            
            const creditsToAdd = creditsPerPlan[priceId];

            const user = await clerk.users.getUser(userId);
            const currentCredits = (user.publicMetadata.generationsLeft as number) || 0;
            
            await clerk.users.updateUserMetadata(userId, {
                publicMetadata: {
                    ...user.publicMetadata,
                    generationsLeft: currentCredits + creditsToAdd,
                }
            });

            console.log(`Successfully added ${creditsToAdd} credits to user ${userId}. New total: ${currentCredits + creditsToAdd}`);

        } catch (error) {
            console.error('Error handling checkout session:', error);
            const message = error instanceof Error ? error.message : 'Internal server error in webhook.';
            return res.status(500).json({ error: message });
        }
    }

    res.status(200).json({ received: true });
}