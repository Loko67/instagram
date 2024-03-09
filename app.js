const Mongo = require("./Mongo").Mongo

const Instagram = require("./Instagram").Instagram

const prepare = require("./prepareFunctions")

require('dotenv').config()

const mongo = new Mongo(process.env.MONGO_BD_NAME)

const inst = new Instagram()

//Добавление в БД пользователей из подписок и подписчиков
async function app(userName) {
  try {

    await inst.login()
    await mongo.connect()

    const id = await inst.getIdUser(userName)

    const info = await inst.getFullInfoUser(id)

    //Проверка закрытого профиля
    if (info.is_private) {

      console.log(`У пользователя ${userName} закрытый профиль`)
      return

    }

    const follower = await inst.getFollower(id)

    //Добавление в БД связи пользователь + его подписчики
    await mongo.insertObj("follower", follower.map(rawFollower => prepare.prepareAddictionFollower(id, rawFollower)))

    //Добавление в БД пользователей - подписчиков
    await mongo.insertObj("users", follower.map(rawUser => prepare.prepareUser(rawUser)))

    const following = await inst.getFollowing(id)

    //Добавление в БД связи пользователь + его подписки
    await mongo.insertObj("follower", following.map(rawFollowing => prepare.prepareAddictionFollower(id, rawFollowing)))

    //Добавлние в БД пользователей - на кого подписан
    await mongo.insertObj("users", following.map(rawUser => prepare.prepareUser(rawUser)))

    console.log(`Всего к API было сделано ${inst.responseCount} запросов`)

    await mongo.close()
    process.exit(0)

  } catch (error) {

    console.error(`Ошибка: ${error}`)

  }
}

app("alexorlov369")