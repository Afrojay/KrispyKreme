import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

export async function POST(req) {
    try {
        const { email, phone, dob, password } = await req.json();

        if (!email || !phone || !dob || !password) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db('app');
        const loginCollection = db.collection('login');

        // Check if user already exists
        const existingUser = await loginCollection.findOne({ username: email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'User already exists' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user with 'username' as email and hashed password
        const newUser = {
            username: email,
            phone,
            dob,
            pass: hashedPassword, // Store hashed password
            acc_type: 'customer', // Default role
        };

        await loginCollection.insertOne(newUser);

        return new Response(
            JSON.stringify({ status: 'success', message: 'User registered successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}