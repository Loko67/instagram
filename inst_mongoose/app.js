const mongoose = require("mongoose")

const { UserModel } = require("./User.model")
const { FollowerModel } = require("./Follower.model")

const options = { dbName: "instagram" }

const Instagram = require("./Instagram").Instagram
const inst = new Instagram()

const utils = require("./utils")

require('dotenv').config()


async function app(userName) {
  try {

    await inst.login()

    const id = await inst.getIdUser(userName)
    const info = await inst.getFullInfoUser(id)

    mongoose.connect(process.env.MONGO_HOST, options)
    const db = mongoose.connection


    db.on("error", error => {
      console.error(`Ошибка: ${error}`)
      process.exit(1)
    })


    db.on("disconnected", () => {
      console.log("Подключение закрыто")
    })


    db.on("connected", async () => {

      console.log("Подключение к базе данных открыто")

      const allUsersFromBd = await utils.getAllObjFromBd(UserModel)
      const allFollowersFromDb = await utils.getAllObjFromBd(FollowerModel)


      //добавление в БД юзера, которого передали при старте
      allUsersFromBd.includes((info.pk).toString()) ?
        await utils.updateToDb(utils.prepareUpdateUser(info), UserModel) :
        await utils.prepareNewUser(info).save()

      const following = await inst.getFollowing(id)

      if (following.length > 0) {

        for (const rawUser of following) {

          allUsersFromBd.includes((rawUser.pk).toString()) ?
            await utils.updateToDb(utils.prepareUpdateUser(rawUser), UserModel) :
            await utils.prepareNewUser(rawUser).save()


          allFollowersFromDb.includes(`_${rawUser.pk}__${info.pk}`) ?
            await utils.updateToDb(utils.prepareUpdateFollower(info.pk, rawUser.pk), FollowerModel) :
            await utils.prepareNewFollower(info.pk, rawUser.pk).save()

        }
      }


      const follower = await inst.getFollower(id)

      if (follower.length > 0) {

        for (const rawUser of follower) {

          allUsersFromBd.includes((rawUser.pk).toString()) ?
            await utils.updateToDb(utils.prepareUpdateUser(rawUser), UserModel) :
            await utils.prepareNewUser(rawUser).save()


          allFollowersFromDb.includes(`_${info.pk}__${rawUser.pk}`) ?
            await utils.updateToDb(utils.prepareUpdateFollower(rawUser.pk, info.pk), FollowerModel) :
            await utils.prepareNewFollower(rawUser.pk, info.pk).save()

        }
      }

      await mongoose.disconnect()

    })

  } catch (error) {
    console.log(`Ошибка ${error}`)
  }
}

app("alexorlov369")