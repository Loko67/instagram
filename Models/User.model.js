const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserSchema = new Schema(
  {
    id: String,
    fullName: String,
    userName: String,
    is_private: Boolean,
    countFollowersAndFollowing: Number,

    dtCreatedAtUTC: {
      type: Date,
      default: new Date()
    },

    dtUpdatedAtUTC: Date

  },

  //добавить количество подписок и подписчиков за счет dtUpdatedAtUTC

  {
    versionKey: false
  }

)

UserSchema.pre(
  "updateOne",
  function (next) {
    this.getUpdate().dtUpdatedAtUTC = new Date()

    next()
  })


const UserModel = mongoose.model("users", UserSchema)

module.exports = { UserModel }