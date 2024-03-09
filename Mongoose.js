const mongoose = require("mongoose")
const { UserModel } = require("./User.model")

const options = { dbName: "instagram" }

require('dotenv').config()

mongoose.connect(process.env.MONGO_HOST, options, (error) => {
    console.log(`Ошибка при подключении: ${error}`)
    process.exit(1)
})

const db = mongoose.connection


db.on("error", error => {
    console.error(`Ошибка: ${error}`)
})


db.on("close", () => {
    console.log("Подключение закрыто")
})

UserModel.findOneAndUpdate(
    { id: rawUser.id },
    user,
    { upsert: true, setDefaultsOnInsert: true }
)










// const user = new UserModel(
//     {
//         fullName: "qwe",
//         userName: "asd",
//         dtCreatedAtUTC: new Date,
//         is_private: false
//     }
// )