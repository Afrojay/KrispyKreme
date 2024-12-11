import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

export async function GET(req) {
    const username = req.nextUrl.searchParams.get('username');

    if (!username) {
        return new Response(
            JSON.stringify({ status: 'error', message: 'Username is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('app');
        const collection = db.collection('shopping_cart');

        // Retrieve cart items for the user
        const cartItems = await collection.find({ username }).toArray();

        return new Response(
            JSON.stringify({ status: 'success', cart: cartItems }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching cart:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}
