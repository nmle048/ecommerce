require('dotenv').config({path: 'backend/.env'});
const {MongoClient} = require('mongodb');

async function main(callback) {
    //const URI = process.env.MONGO_URI;
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        await callback(client);
    }
    catch (err) {
        console.error(err);
        throw new Error('Unable to Connect to Database');
    }
}

module.exports = main;