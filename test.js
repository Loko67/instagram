const mongoose = require("mongoose")
const { UserModel } = require("./User.model")

const options = { dbName: "instagram" }

const Instagram = require("./Instagram").Instagram
const inst = new Instagram()

require('dotenv').config()

// async function test(userName) {
//   try {

//     await inst.login()
//     const id = await inst.getIdUser(userName)
//     const info = await inst.getFullInfoUser(id)

//     //Проверка закрытого профиля
//     if (info.is_private) {

//       console.log(`У пользователя ${userName} закрытый профиль`)
//       return

//     }


//     const following = await inst.getFollowing(id)


//     mongoose.connect(process.env.MONGO_HOST, options, (error) => {
//       console.log(`Ошибка при подключении: ${error}`)
//       process.exit(1)
//     })


//     const db = mongoose.connection


//     db.on("error", error => {
//       console.error(`Ошибка: ${error}`)
//     })


//     db.on("close", () => {
//       console.log("Подключение закрыто")
//     })


//     for (const rawUser of following) {

//       const user = new UserModel(
//         {
//           id: rawUser.pk,
//           fullName: rawUser.full_name || '',
//           userName: rawUser.username,
//           is_private: rawUser.is_private
//         }
//       )

//       UserModel.findOneAndUpdate(
//         { id: rawUser.id },
//         user,
//         { upsert: true, setDefaultsOnInsert: true }
//     )

//     }

//     await Connection.close()

//   } catch (error) {
//     console.log(`Ошибка ${error}`)
//   }
// }

// test("alexorlov369")