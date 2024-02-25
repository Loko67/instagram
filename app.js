const Mongo = require("./classMongo")

const Instagram = require("./classInstagram")

const prepare = require("./prepareFunctions")

require('dotenv').config()

const mongo = new Mongo(process.env.MONGO_BD_NAME)

const inst = new Instagram()

//Добавление в БД пользователей из подписок и подписчиков
async function app(userName) {
  try {

    await inst.login()

    const id = await inst.getIdUser(userName)

    const info = await inst.getFullInfoUser(id)

    //Проверка закрытого профиля
    if (info.is_private) {

      console.log(`У пользователя ${userName} закрытый профиль`)
      return

    }

    const follower = await inst.getFollower(id)

    const following = await inst.getFollowing(id)

    await mongo.connect()

    if (follower.length > 0) {

      //Добавление в БД связи пользователь + его подписчики
      await mongo.insertObj("addiction", follower.map(rawFollower => prepare.prepareAddictionFollower(id, rawFollower)))

      //Добавление в БД пользователей - подписчиков
      await mongo.insertObj("users", follower.map(rawUser => prepare.prepareUser(rawUser)))

    } else {

      console.log(`У пользователя ${userName} нет подписчиков`)

    }

    if (following.length > 0) {

      //Добавление в БД связи пользователь + его подписки
      await mongo.insertObj("addiction", following.map(rawFollowing => prepare.prepareAddictionFollower(id, rawFollowing)))

      //Добавлние в БД пользователей - на кого подписан
      await mongo.insertObj("users", following.map(rawUser => prepare.prepareUser(rawUser)))

    } else {

      console.log(`Пользователь ${userName} ни на кого не подписан`)

    }

    await mongo.close()

  } catch (error) {

    console.error(`Ошибка: ${error}`)

  }
}