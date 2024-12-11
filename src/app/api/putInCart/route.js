import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

export async function POST(req) {
    const { username, pname, quantity } = await req.json();

    if (!username || !pname || !quantity || quantity <= 0) {
        return new Response(
            JSON.stringify({ status: 'error', message: 'Invalid input: username, pname, and quantity are required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('app');
        const product = await db.collection('products').findOne({ pname });
        if (!product) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'Product not found.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await db.collection('shopping_cart').updateOne(
            { username, pname },
            { $set: { pname, price: product.price }, $inc: { quantity } },
            { upsert: true }
        );

        const updatedCart = await db.collection('shopping_cart').find({ username }).toArray();
        return new Response(JSON.stringify({ status: 'success', cart: updatedCart }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'Internal server error.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}
