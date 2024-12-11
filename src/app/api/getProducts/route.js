import { MongoClient } from 'mongodb';

export async function GET() {
    const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('app');
        const products = await db.collection('products').find({}).toArray();

        return new Response(JSON.stringify({ products }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await client.close();
    }
}
