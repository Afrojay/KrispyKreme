const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb+srv://admin:pass@cluster0.wg2ou.mongodb.net/app?retryWrites=true&w=majority';

async function hashPasswords() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("app"); // Replace 'app' with your database name if different
    const loginCollection = db.collection("login"); // Replace 'login' with your collection name if different

    const users = await loginCollection.find({}).toArray();

    for (let user of users) {
      if (!user.pass.startsWith("$2b$")) {
        // Check if already hashed
        const hashedPassword = await bcrypt.hash(user.pass, 10);
        await loginCollection.updateOne(
          { _id: user._id },
          { $set: { pass: hashedPassword } }
        );
        console.log(`Updated password for user: ${user.username}`);
      }
    }

    console.log("Passwords updated successfully!");
  } catch (err) {
    console.error("Error during password hashing:", err);
  } finally {
    await client.close();
  }
}

hashPasswords();
