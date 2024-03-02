const mongoose = require("mongoose")
const { UserModel } = require("./User.model")

const options = { dbName: "instagram" }

const Instagram = require("./Instagram").Instagram
const inst = new Instagram()

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

      console.log("Подключение к базе данных успешно")

      const user = new UserModel(
        {
          id: info.pk,
          fullName: info.full_name || '',
          userName: info.username,
          is_private: info.is_private
        }
      )

      if (await UserModel.findOne({ id: user.id })) {

        await UserModel.updateOne(
          { id: user.id },
          {
            $set:
            {
              id: user.id,
              fullName: user.fullName,
              userName: user.userName,
              is_private: user.is_private,
              dtUpdatedAtUTC: new Date()
            }
          }
        )

      } else {
        await user.save()
      }

      if (info.is_private) {

        await mongoose.disconnect()
        return

      }

      const following = await inst.getFollowing(id)

      for (const rawUser of following) {
        const user = new UserModel(
          {
            id: info.pk,
            fullName: info.full_name || '',
            userName: info.username,
            is_private: info.is_private
          }
        )

        if (await UserModel.findOne({ id: user.id })) {

          await UserModel.updateOne(
            { id: user.id },
            {
              $set:
              {
                id: user.id,
                fullName: user.fullName,
                userName: user.userName,
                is_private: user.is_private,
                dtUpdatedAtUTC: new Date()
              }
            }
          )

        } else {
          await user.save()
        }
      }

      await mongoose.disconnect()

    })

  } catch (error) {
    console.log(`Ошибка ${error}`)
  }
}

app("alexorlov369")