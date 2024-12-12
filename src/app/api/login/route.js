import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

export async function POST(req) {
    const { username, pass } = await req.json();

    if (!username || !pass) {
        return new Response(
            JSON.stringify({ status: 'error', message: 'Username and password are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('app');
        const collection = db.collection('login');

        console.log('Login attempt:', username);

        // Find the user with matching username
        const user = await collection.findOne({ username: username.toLowerCase() });

        if (!user) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'Invalid username or password' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(pass, user.pass);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ status: 'error', message: 'Invalid username or password' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, acc_type: user.acc_type },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return new Response(
            JSON.stringify({
                status: 'success',
                message: 'Login successful',
                token,
                user: { id: user._id, username: user.username, acc_type: user.acc_type },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}