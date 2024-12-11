import { MongoClient } from 'mongodb';

// MongoDB connection URI
const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

export async function POST(req) {
    const { username } = await req.json();

    // Validate input
    if (!username || typeof username !== 'string') {
        return new Response(
            JSON.stringify({ status: 'error', message: 'Invalid username' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('app');
        const shoppingCartCollection = db.collection('shopping_cart');
        const ordersCollection = db.collection('orders');

        // Fetch cart items for the user
        const cartItems = await shoppingCartCollection.find({ username }).toArray();

        if (!cartItems.length) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'Your cart is empty' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Calculate total cost
        const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Save the order in the database
        const order = {
            username,
            items: cartItems,
            total,
            timestamp: new Date(),
        };
        await ordersCollection.insertOne(order);

        // Clear the user's shopping cart
        await shoppingCartCollection.deleteMany({ username });

        return new Response(
            JSON.stringify({
                status: 'success',
                message: 'Order placed successfully!',
                order: {
                    username,
                    total,
                    items: cartItems,
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Checkout Error:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'An error occurred during checkout' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}
