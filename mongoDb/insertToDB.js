const { MongoClient } = require('mongodb')

const MongoDBclient = new MongoClient(process.env.MONGO_HOST)

async function insertPost(post) {

    try {
        await MongoDBclient.connect()
        const db = MongoDBclient.db("instagram")
        const postsCollection = db.collection("posts")
        await postsCollection.insertOne(post)
        await MongoDBclient.close()

    } catch (e) {
        console.log(e)
    }
}

async function insertUser(user) {

    try {
        await MongoDBclient.connect()
        const db = MongoDBclient.db("instagram")
        const postsCollection = db.collection("users")
        await postsCollection.insertOne(post)
        await MongoDBclient.close()

    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    insertPost,
    insertUser
}