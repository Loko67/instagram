const mongoose = require("mongoose")

const options = { dbName: "instagram" }

const Instagram = require("./Instagram").Instagram
const inst = new Instagram()

const utils = require("./utils")

require('dotenv').config()

/**
 * Получение информации о подписках и подписчиках пользователя
 * и добавление этой информации в БД
 * 
 * @param {String} userName имя пользователя, по которому нужно получить информацию
 * 
 */
async function app(userName) {
  try {

    //Залогиниться в Instagram
    await inst.login()

    //Получить данные о пользователе, которого передали при старте
    const id = await inst.getIdUser(userName)
    const info = await inst.getFullInfoUser(id)

    mongoose.connect(process.env.MONGO_HOST, options)
    const db = mongoose.connection


    db.on("error", error => {
      console.error(`Ошибка подключения к БД: ${error}`)
      process.exit(1)
    })


    db.on("disconnected", () => {
      console.log("Подключение закрыто")
    })


    db.on("connected", async () => {

      console.log("Подключение к базе данных открыто")

      try {

        //Проверить пользователя, которого передали при запуске
        await utils.prepareUserName(info)
        await utils.prepareUser(info)

        //Получить массив с подписками
        const following = await inst.getFollowing(id)

        if (following.length > 0) {

          for (const rawUser of following) {

            await utils.prepareUserName(rawUser)
            await utils.prepareUser(rawUser)
            await utils.prepareFollower(info.pk, rawUser.pk)

          }
        }


        //Получить массив с подписчиками
        const follower = await inst.getFollower(id)

        if (follower.length > 0) {

          for (const rawUser of follower) {

            await utils.prepareUserName(rawUser)
            await utils.prepareUser(rawUser)
            await utils.prepareFollower(rawUser.pk, info.pk)

          }
        }

        await mongoose.disconnect()

      } catch (error) {
        console.error(error.message)
        if (error) process.exit(1)
      }
    })

  } catch (error) {
    console.error(error.message)
    if (error) process.exit(1)
  }
}