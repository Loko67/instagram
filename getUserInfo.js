const { IgApiClient } = require("instagram-private-api")

const getFunctions = require("./getFunctions")

require('dotenv').config()

const IG_USERNAME = process.env.IG_USERNAME
const IG_PASSWORD = process.env.IG_PASSWORD

const ig = new IgApiClient()

ig.state.generateDevice(IG_USERNAME)

async function getUserInfo() {
    try {

        //Логинимся
        await ig.account.login(IG_USERNAME, IG_PASSWORD)

        //получить id пользователя
        const id = await ig.user.getIdByUsername(IG_USERNAME)

        //получить инфо по пользователю
        const info = await ig.user.info(id)

        //получить посты пользователя
        //Пока не работает
        const userFeed = ig.feed.user(id)
        const posts = await getFunctions.getPosts(userFeed)

        //получить подписки пользователя
        const followersFeed = ig.feed.accountFollowers(id)
        const followers = await getFunctions.getFollower(followersFeed)

        //получить подписчиков пользователя
        const followingFeed = ig.feed.accountFollowing(id)
        const followings = await getFunctions.getFollowing(followingFeed)

    } catch (error) {
        console.error('Ошибка:', error)
    }
}