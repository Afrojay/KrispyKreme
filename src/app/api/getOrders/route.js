import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

export async function GET(req) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('app');
        const ordersCollection = db.collection('orders');

        // Fetch all orders
        const orders = await ordersCollection.find({}).toArray();

        return new Response(
            JSON.stringify({ status: 'success', data: orders }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}
