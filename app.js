const mongoose = require("mongoose")

const _ = require('lodash')

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
        await utils.upsertUserName(info)
        await utils.upsertUser(info)


        for await (const following of inst.getFollowing(id)) {
          await utils.upsertUserName(following)
          await utils.upsertUser(following)
          await utils.upsertFollower(info.pk, following.pk)
        }

        for await (const follower of inst.getFollower(id)) {
          await utils.upsertUserName(follower)
          await utils.upsertUser(follower)
          await utils.upsertFollower(follower.pk, info.pk)
        }

        await mongoose.disconnect()

      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

app("its_lucylucy")