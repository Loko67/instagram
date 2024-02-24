const Mongo = require("./classMongo")

const Instagram = require("./classInstagram")

const prepare = require("./prepareFunctions")

require('dotenv').config()

const mongo = new Mongo("instagram")

const inst = new Instagram()

//Добавление в БД пользователей из подписок и подписчиков
async function app(userName) {
  try {

    await inst.login()

    const id = await inst.getIdUser(userName)

    const follower = await inst.getFollower(id)

    const following = await inst.getFollowing(id)

    await mongo.connect()

    await mongo.insertObj("users", follower.map(rawUser => prepare.prepareUser(rawUser)))

    await mongo.insertObj("users", following.map(rawUser => prepare.prepareUser(rawUser)))

    await mongo.close()

  } catch (error) {

    console.error(`Ошибка: ${error}`)

  }
}