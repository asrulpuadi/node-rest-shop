const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_ATLAS || "mongodb+srv://node_shop:node_shop@node-rest-shop.fffgly4.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function run() {
  try {
    console.log("MASUK SINI <<<<<<")

        const database = client.db('local_library');
        const posts = database.collection('posts');

        // Queries for a movie that has a title value of 'Back to the Future'
        const query = { name: 'book' };
        const post = await posts.findOne(query);

        console.log(post);

  } catch (error) {
        console.log(error);
  }
}

function getDb() {
  return db;
}

module.exports = {
    run,
    getDb,
    client
};